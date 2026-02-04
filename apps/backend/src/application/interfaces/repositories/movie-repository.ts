import { Movie } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

export interface MovieRepository {
  create(data: Omit<Movie, "id" | "votes" | "score" | "createdAt" | "updatedAt">): Promise<Movie>;
  findById(id: Uuid): Promise<Movie | null>;
  findAll(): Promise<Movie[]>;
  update(id: Uuid, data: Partial<Omit<Movie, "id" | "createdAt" | "updatedAt">>): Promise<Movie>;
  delete(id: Uuid): Promise<void>;
}
