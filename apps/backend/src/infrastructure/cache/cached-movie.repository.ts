import type { CacheProvider } from "@/application/interfaces/providers/cache-provider";
import type {
  MovieRepository,
  UpdateMovieData
} from "@/application/interfaces/repositories/movie-repository";
import type { MovieWithUser } from "@/application/read-models";
import type { Movie } from "@/domain/entities";
import type { MovieQuery, PaginatedResult, Uuid } from "@/domain/value-objects";

const MOVIES_LIST_KEY = "movies:list";
const DEFAULT_TTL = 300;

export class CachedMovieRepository implements MovieRepository {
  constructor(
    private readonly inner: MovieRepository,
    private readonly cache: CacheProvider
  ) {}

  async findPublicOrOwnedByIdWithCreator(
    id: Uuid,
    userId: Uuid
  ): Promise<MovieWithUser | null> {
    const key = `movie:${id}`;
    const field = userId.toString();
    const cached = await this.cache.hget<MovieWithUser>({ key, field });
    if (cached) return cached;

    const result = await this.inner.findPublicOrOwnedByIdWithCreator(
      id,
      userId
    );
    if (result) {
      await this.cache.hset({ key, field, value: result, ttlSeconds: DEFAULT_TTL });
    }
    return result;
  }

  async findAll(query: MovieQuery): Promise<PaginatedResult<Movie>> {
    const field = this.serializeQuery(query);
    const cached = await this.cache.hget<PaginatedResult<Movie>>({
      key: MOVIES_LIST_KEY,
      field
    });
    if (cached) return cached;

    const result = await this.inner.findAll(query);
    await this.cache.hset({ key: MOVIES_LIST_KEY, field, value: result, ttlSeconds: DEFAULT_TTL });
    return result;
  }

  async create(movie: Movie): Promise<Movie> {
    const result = await this.inner.create(movie);
    await this.cache.delete(MOVIES_LIST_KEY);
    return result;
  }

  async update(id: Uuid, data: UpdateMovieData): Promise<Movie | null> {
    const result = await this.inner.update(id, data);
    await this.cache.delete(`movie:${id}`);
    await this.cache.delete(MOVIES_LIST_KEY);
    return result;
  }

  async delete(id: Uuid): Promise<boolean> {
    const result = await this.inner.delete(id);
    await this.cache.delete(`movie:${id}`);
    await this.cache.delete(MOVIES_LIST_KEY);
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
