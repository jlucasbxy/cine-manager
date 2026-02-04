import { Movie } from "@/domain/entities";
import { MovieRepository } from "@/application/interfaces/repositories/movie-repository";
import { MovieQuery } from "@/domain/value-objects/movie-query.value-object";
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
