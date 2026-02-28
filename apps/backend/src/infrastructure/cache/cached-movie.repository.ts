import type { CacheProvider } from "@/application/interfaces/providers/cache-provider";
import type {
  MovieRepository,
  UpdateMovieData,
} from "@/application/interfaces/repositories/movie-repository";
import type { MovieWithUser } from "@/application/read-models";
import type { Movie } from "@/domain/entities";
import type { MovieQuery, PaginatedResult, Uuid } from "@/domain/value-objects";

const DEFAULT_TTL = 300;

export class CachedMovieRepository implements MovieRepository {
  private readonly movieKeys = new Map<string, Set<string>>();
  private readonly listKeys = new Set<string>();

  constructor(
    private readonly inner: MovieRepository,
    private readonly cache: CacheProvider
  ) {}

  async findPublicOrOwnedByIdWithCreator(
    id: Uuid,
    userId: Uuid
  ): Promise<MovieWithUser | null> {
    const key = `movie:${id}:${userId}`;
    const cached = await this.cache.get<MovieWithUser>(key);
    if (cached) return cached;

    const result = await this.inner.findPublicOrOwnedByIdWithCreator(
      id,
      userId
    );
    if (result) {
      await this.cache.set(key, result, DEFAULT_TTL);
      this.trackMovieKey(id.toString(), key);
    }
    return result;
  }

  async findAll(query: MovieQuery): Promise<PaginatedResult<Movie>> {
    const key = `movies:list:${this.serializeQuery(query)}`;
    const cached = await this.cache.get<PaginatedResult<Movie>>(key);
    if (cached) return cached;

    const result = await this.inner.findAll(query);
    await this.cache.set(key, result, DEFAULT_TTL);
    this.listKeys.add(key);
    return result;
  }

  async create(movie: Movie): Promise<Movie> {
    const result = await this.inner.create(movie);
    await this.invalidateListKeys();
    return result;
  }

  async update(id: Uuid, data: UpdateMovieData): Promise<Movie | null> {
    const result = await this.inner.update(id, data);
    await this.invalidateMovieKeys(id.toString());
    await this.invalidateListKeys();
    return result;
  }

  async delete(id: Uuid): Promise<boolean> {
    const result = await this.inner.delete(id);
    await this.invalidateMovieKeys(id.toString());
    await this.invalidateListKeys();
    return result;
  }

  private trackMovieKey(movieId: string, key: string): void {
    const keys = this.movieKeys.get(movieId);
    if (keys) {
      keys.add(key);
    } else {
      this.movieKeys.set(movieId, new Set([key]));
    }
  }

  private async invalidateMovieKeys(movieId: string): Promise<void> {
    const keys = this.movieKeys.get(movieId);
    if (!keys) return;
    await Promise.all([...keys].map((key) => this.cache.delete(key)));
    this.movieKeys.delete(movieId);
  }

  private async invalidateListKeys(): Promise<void> {
    await Promise.all([...this.listKeys].map((key) => this.cache.delete(key)));
    this.listKeys.clear();
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
      currentUserId: query.currentUserId.toString(),
    });
  }
}
