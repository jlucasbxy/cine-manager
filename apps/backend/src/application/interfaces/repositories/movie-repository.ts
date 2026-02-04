import { Movie } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

export type UpdateMovieData = Partial<Omit<Movie, "id" | "createdAt" | "updatedAt">>;

export type MovieFilters = {
  runtime: number;
  releaseDateStart: Date;
  releaseDateEnd: Date;
};

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>;
  findById(id: Uuid): Promise<Movie | null>;
  findAll(filters: MovieFilters): Promise<Movie[]>;
  update(id: Uuid, data: UpdateMovieData): Promise<Movie>;
  delete(id: Uuid): Promise<void>;
}
