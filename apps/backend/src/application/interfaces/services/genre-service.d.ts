import type { GenreDTO } from "@repo/dtos";

export interface GenreService {
  listGenres(): Promise<GenreDTO[]>;
}
