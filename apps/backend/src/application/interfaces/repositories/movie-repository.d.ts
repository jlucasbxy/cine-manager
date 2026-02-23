import { Movie } from "@/domain/entities";
import { Uuid, MovieQuery, PaginatedResult } from "@/domain/value-objects";
import type { MovieWithUser } from "@/application/read-models";

export type UpdateMovieData = Partial<
  Omit<Movie, "id" | "createdAt" | "updatedAt">
>;

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>;
  exists(id: Uuid): Promise<boolean>;
  findById(id: Uuid): Promise<Movie | null>;
  findByIdWithUser(id: Uuid): Promise<MovieWithUser | null>;
  findAll(query: MovieQuery): Promise<PaginatedResult<Movie>>;
  update(id: Uuid, data: UpdateMovieData): Promise<Movie | null>;
  delete(id: Uuid): Promise<boolean>;
}
