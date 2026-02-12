import { Movie } from "@/domain/entities";
import { Uuid, MovieQuery } from "@/domain/value-objects";

export type UpdateMovieData = Partial<Omit<Movie, "id" | "createdAt" | "updatedAt">>;

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>;
  findById(id: Uuid): Promise<Movie | null>;
  findAll(query: MovieQuery): Promise<Movie[]>;
  update(id: Uuid, data: UpdateMovieData): Promise<Movie | null>;
  delete(id: Uuid): Promise<void>;
}
