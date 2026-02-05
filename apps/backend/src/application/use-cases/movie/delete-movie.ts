import { Uuid } from "@/domain/value-objects";
import { MovieNotFoundError } from "@/domain/errors";
import type { MovieRepository } from "@/application/interfaces/repositories";

export class DeleteMovie {
  constructor(
    private readonly movieRepository: MovieRepository
  ) { }

  async execute(uuid: string): Promise<void> {
    const id = Uuid.create(uuid);

    const existingMovie = await this.movieRepository.findById(id);
    if (!existingMovie) {
      throw new MovieNotFoundError();
    }

    return this.movieRepository.delete(id);
  }
}
