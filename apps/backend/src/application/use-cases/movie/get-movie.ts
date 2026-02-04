import { Movie } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects/uuid.value-object";
import { MovieNotFoundError } from "@/domain/errors/movie-not-found.error";
import { MovieRepository } from "@/application/interfaces/repositories/movie-repository";

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
