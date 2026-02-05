import { Movie } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects";
import { MovieNotFoundError } from "@/domain/errors";
import type { MovieRepository } from "@/application/interfaces/repositories";

interface GetMovieInput {
  id: string;
}

export class GetMovie {
  constructor(
    private readonly movieRepository: MovieRepository
  ) {}

  async execute(input: GetMovieInput): Promise<Movie> {
    const movie = await this.movieRepository.findById(Uuid.create(input.id));
    if (!movie) {
      throw new MovieNotFoundError();
    }

    return movie;
  }
}
