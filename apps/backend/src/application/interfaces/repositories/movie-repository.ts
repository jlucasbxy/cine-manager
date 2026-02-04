import { Movie } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

type CreateMovieData = Omit<Movie, "id" | "votes" | "score" | "createdAt" | "updatedAt">;
type UpdateMovieData = Partial<Omit<Movie, "id" | "createdAt" | "updatedAt">>;

export interface MovieRepository {
  create(data: CreateMovieData): Promise<Movie>;
  findById(id: Uuid): Promise<Movie | null>;
  findAll(): Promise<Movie[]>;
  update(id: Uuid, data: UpdateMovieData): Promise<Movie>;
  delete(id: Uuid): Promise<void>;
}
