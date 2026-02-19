import { MovieQuery } from "@/domain/value-objects";
import type { MovieRepository } from "@/application/interfaces/repositories";
import { MovieMapper } from "@/application/mappers";
import { MovieStatusEnum, AgeRatingEnum } from "@/domain/enums";
import type { QueryMoviesDTO, MovieDTO, PaginatedResultDTO } from "@repo/dtos";

export class ListMovies {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(input: QueryMoviesDTO): Promise<PaginatedResultDTO<MovieDTO>> {
    const query = MovieQuery.create({
      ...input,
      status: input.status as MovieStatusEnum | undefined,
      ageRating: input.ageRating as AgeRatingEnum | undefined
    });
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
