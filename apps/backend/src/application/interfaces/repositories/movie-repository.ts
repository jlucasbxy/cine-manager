import type { MovieWithUser } from "@/application/read-models";
import type { Movie } from "@/domain/entities";
import type { MovieQuery, PaginatedResult, Uuid } from "@/domain/value-objects";

export type UpdateMovieData = Partial<
  Omit<Movie, "id" | "createdAt" | "updatedAt">
>;

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>;
  findPublicOrOwnedByIdWithCreator(
    id: Uuid,
    userId: Uuid
  ): Promise<MovieWithUser | null>;
  findAll(query: MovieQuery): Promise<PaginatedResult<Movie>>;
  update(id: Uuid, data: UpdateMovieData): Promise<Movie | null>;
  delete(id: Uuid): Promise<boolean>;
}
