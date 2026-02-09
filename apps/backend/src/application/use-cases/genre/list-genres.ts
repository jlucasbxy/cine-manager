import type { GenreRepository } from "@/application/interfaces/repositories";
import type { GenreDTO } from "@repo/dtos";

export class ListGenres {
  constructor(private readonly genreRepository: GenreRepository) {}

  async execute(): Promise<GenreDTO[]> {
    return this.genreRepository.findAll();
  }
}
