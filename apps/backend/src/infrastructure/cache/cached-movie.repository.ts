import z from "zod";
import type { CacheProvider } from "@/application/interfaces/providers/cache-provider";
import type {
  MovieRepository,
  UpdateMovieData
} from "@/application/interfaces/repositories/movie-repository";
import type { MovieWithUser } from "@/application/read-models";
import { Movie } from "@/domain/entities";
import { type MovieQuery, PaginatedResult, Uuid } from "@/domain/value-objects";
import { MovieMapper } from "@/application/mappers";
import { ageRatingSchema, movieStatusSchema } from "@repo/validators";

const cachedMovieSchema = z.object({
  id: z.string(),
  title: z.string(),
  originalTitle: z.string(),
  tagline: z.string(),
  synopsis: z.string(),
  releaseDate: z.string(),
  runtime: z.number().int().nonnegative(),
  status: movieStatusSchema,
  ageRating: ageRatingSchema,
  languageId: z.string(),
  budget: z.number().nonnegative(),
  revenue: z.number().nonnegative(),
  posterUrl: z.string(),
  backdropUrl: z.string(),
  trailerUrl: z.string(),
  votes: z.number().int().nonnegative(),
  score: z.number().nonnegative(),
  isPublic: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string()
});

const cachedMoviePublisherSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable()
});

const cachedMovieWithUserSchema = z.object({
  movie: cachedMovieSchema,
  user: cachedMoviePublisherSchema.nullable()
});

const cachedPaginatedMovieSchema = z.object({
  items: z.array(cachedMovieSchema),
  nextCursor: z.string().nullable(),
  hasNextPage: z.boolean()
});

const MOVIES_LIST_KEY = "movies:list";
const DEFAULT_TTL = 300;

export class CachedMovieRepository implements MovieRepository {
  constructor(
    private readonly inner: MovieRepository,
    private readonly cache: CacheProvider
  ) {}

  async findByIdForUpdate(id: Uuid): Promise<Movie | null> {
    return this.inner.findByIdForUpdate(id);
  }

  async findPublicOrOwnedByIdWithCreator(
    id: Uuid,
    userId: Uuid
  ): Promise<MovieWithUser | null> {
    const key = `movie:${id}`;
    const field = userId.toString();
    const raw = await this.cache.hget({ key, field });
    const parsed = cachedMovieWithUserSchema.safeParse(raw);
    if (parsed.success) {
      return {
        movie: MovieMapper.fromDto(parsed.data.movie),
        user: parsed.data.user
      };
    }

    const result = await this.inner.findPublicOrOwnedByIdWithCreator(
      id,
      userId
    );
    if (result) {
      await this.cache.hset({
        key,
        field,
        value: {
          movie: MovieMapper.toDTO(result.movie),
          user: result.user
        },
        ttlSeconds: DEFAULT_TTL
      });
    }
    return result;
  }

  async findAll(query: MovieQuery): Promise<PaginatedResult<Movie>> {
    const field = this.serializeQuery(query);
    const raw = await this.cache.hget({ key: MOVIES_LIST_KEY, field });
    const parsed = cachedPaginatedMovieSchema.safeParse(raw);
    if (parsed.success) {
      return PaginatedResult.create(
        parsed.data.items.map((movie) => MovieMapper.fromDto(movie)),
        parsed.data.nextCursor,
        parsed.data.hasNextPage
      );
    }

    const result = await this.inner.findAll(query);
    await this.cache.hset({
      key: MOVIES_LIST_KEY,
      field,
      value: {
        items: result.items.map((movie) => MovieMapper.toDTO(movie)),
        nextCursor: result.nextCursor,
        hasNextPage: result.hasNextPage
      },
      ttlSeconds: DEFAULT_TTL
    });
    return result;
  }

  async create(movie: Movie): Promise<Movie> {
    const result = await this.inner.create(movie);
    await this.cache.delete(MOVIES_LIST_KEY);
    return result;
  }

  async update(id: Uuid, data: UpdateMovieData): Promise<Movie | null> {
    const result = await this.inner.update(id, data);
    await this.cache.delete(`movie:${id}`, MOVIES_LIST_KEY);
    return result;
  }

  async delete(id: Uuid): Promise<boolean> {
    const result = await this.inner.delete(id);
    await this.cache.delete(`movie:${id}`, MOVIES_LIST_KEY);
    return result;
  }

  private serializeQuery(query: MovieQuery): string {
    return JSON.stringify({
      runtime: query.runtime?.toNumber(),
      releaseDateStart: query.releaseDateStart?.toISOString(),
      releaseDateEnd: query.releaseDateEnd?.toISOString(),
      cursor: query.cursor?.toString(),
      limit: query.limit.toNumber(),
      status: query.status,
      ageRating: query.ageRating,
      search: query.search,
      userId: query.userId?.toString(),
      genreIds: query.genreIds,
      currentUserId: query.currentUserId.toString()
    });
  }
}
