import type { GenreDTO } from "@repo/dtos";
import type { GenreRepository } from "@/application/interfaces/repositories";

export class ListGenres {
  constructor(private readonly genreRepository: GenreRepository) {}

  async execute(): Promise<GenreDTO[]> {
    return this.genreRepository.findAll();
  }
}
