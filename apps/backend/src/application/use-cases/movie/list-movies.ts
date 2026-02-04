import { Movie } from "@/domain/entities";
import { MovieRepository } from "@/application/interfaces/repositories/movie-repository";
import { QueryMoviesDTO } from "@repo/dtos";

export class ListMovies {
  constructor(
    private readonly movieRepository: MovieRepository
  ) { }

  async execute(input: QueryMoviesDTO): Promise<Movie[]> {
    return this.movieRepository.findAll({
      runtime: input.runtime,
      releaseDateStart: new Date(input.releaseDateStart),
      releaseDateEnd: new Date(input.releaseDateEnd)
    });
  }
}
