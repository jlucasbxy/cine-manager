import { Uuid } from "@/domain/value-objects/uuid.value-object";
import { MovieNotFoundError } from "@/domain/errors/movie-not-found.error";
import { MovieRepository } from "@/application/interfaces/repositories/movie-repository";

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
