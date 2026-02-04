import { Uuid } from "@/domain/value-objects/uuid.value-object";
import { MovieNotFoundError } from "@/domain/errors/movie-not-found.error";
import { MovieRepository } from "@/application/interfaces/repositories/movie-repository";

interface DeleteMovieInput {
  id: string;
}

export class DeleteMovie {
  constructor(
    private readonly movieRepository: MovieRepository
  ) {}

  async execute(input: DeleteMovieInput): Promise<void> {
    const id = Uuid.create(input.id);

    const existingMovie = await this.movieRepository.findById(id);
    if (!existingMovie) {
      throw new MovieNotFoundError();
    }

    return this.movieRepository.delete(id);
  }
}
