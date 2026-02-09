import type { GenreDTO } from "@repo/dtos";

export interface GenreRepository {
  findAll(): Promise<GenreDTO[]>;
}
