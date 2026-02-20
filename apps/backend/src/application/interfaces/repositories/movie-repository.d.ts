import { Movie } from "@/domain/entities";
import { Uuid, MovieQuery, PaginatedResult } from "@/domain/value-objects";

export type UpdateMovieData = Partial<
  Omit<Movie, "id" | "createdAt" | "updatedAt">
>;

export type MoviePublisher = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type MovieWithUser = {
  movie: Movie;
  user: MoviePublisher | null;
};

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>;
  findById(id: Uuid): Promise<Movie | null>;
  findByIdWithUser(id: Uuid): Promise<MovieWithUser | null>;
  findAll(query: MovieQuery): Promise<PaginatedResult<Movie>>;
  update(id: Uuid, data: UpdateMovieData): Promise<Movie | null>;
  delete(id: Uuid): Promise<boolean>;
}
