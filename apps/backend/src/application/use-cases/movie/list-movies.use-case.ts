import { MovieQuery } from "@/domain/value-objects";
import type { MovieRepository } from "@/application/interfaces/repositories";
import { MovieMapper } from "@/application/mappers";
import type { QueryMoviesDTO, MovieDTO, PaginatedResultDTO } from "@repo/dtos";

export class ListMovies {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(input: QueryMoviesDTO): Promise<PaginatedResultDTO<MovieDTO>> {
    const query = MovieQuery.create(input);
    const result = await this.movieRepository.findAll(query);
    const total = result.total.toNumber();
    return {
      data: result.items.map(MovieMapper.toDTO),
      meta: {
        page: input.page,
        perPage: input.perPage,
        totalItems: total,
        totalPages: Math.ceil(total / input.perPage)
      }
    };
  }
}
