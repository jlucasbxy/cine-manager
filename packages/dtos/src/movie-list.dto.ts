import type { MovieDTO } from "./movie.dto";

export interface MovieListDTO {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  movies?: MovieDTO[];
}
