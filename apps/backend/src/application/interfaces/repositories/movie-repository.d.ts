import { Movie } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects/uuid.value-object";
import { MovieQuery } from "@/domain/value-objects/movie-query.value-object";

export type UpdateMovieData = Partial<Omit<Movie, "id" | "createdAt" | "updatedAt">>;

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>;
  findById(id: Uuid): Promise<Movie | null>;
  findAll(query: MovieQuery): Promise<Movie[]>;
  update(id: Uuid, data: UpdateMovieData): Promise<Movie>;
  delete(id: Uuid): Promise<void>;
}
