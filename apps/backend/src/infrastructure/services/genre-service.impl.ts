import type { GenreDTO } from "@repo/dtos";
import type { GenreService } from "@/application/interfaces/services";
import type { ListGenres } from "@/application/use-cases/genre";

export class GenreServiceImpl implements GenreService {
  constructor(private readonly listGenresUseCase: ListGenres) {}

  async listGenres(): Promise<GenreDTO[]> {
    return this.listGenresUseCase.execute();
  }
}
