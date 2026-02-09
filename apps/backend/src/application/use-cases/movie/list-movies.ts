import { MovieQuery } from "@/domain/value-objects";
import type { MovieRepository } from "@/application/interfaces/repositories";
import { MovieMapper } from "@/application/mappers";
import type { QueryMoviesDTO, MovieDTO } from "@repo/dtos";

export class ListMovies {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(input: QueryMoviesDTO): Promise<MovieDTO[]> {
    const query = MovieQuery.create(input);
    const movies = await this.movieRepository.findAll(query);
    return movies.map(MovieMapper.toDTO);
  }
}
