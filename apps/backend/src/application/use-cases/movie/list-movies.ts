import { Movie } from "@/domain/entities";
import { MovieQuery } from "@/domain/value-objects";
import type { MovieRepository } from "@/application/interfaces/repositories";
import { QueryMoviesDTO } from "@repo/dtos";

export class ListMovies {
  constructor(
    private readonly movieRepository: MovieRepository
  ) { }

  async execute(input: QueryMoviesDTO): Promise<Movie[]> {
    const query = MovieQuery.create(input);
    return this.movieRepository.findAll(query);
  }
}
