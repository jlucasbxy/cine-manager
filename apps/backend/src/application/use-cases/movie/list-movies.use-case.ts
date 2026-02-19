import type { MovieDTO, PaginatedResultDTO, QueryMoviesDTO } from "@repo/dtos";
import type { MovieRepository } from "@/application/interfaces/repositories";
import { MovieMapper } from "@/application/mappers";
import type { AgeRatingEnum, MovieStatusEnum } from "@/domain/enums";
import { MovieQuery } from "@/domain/value-objects";

export class ListMovies {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(
    input: QueryMoviesDTO,
    userId: string
  ): Promise<PaginatedResultDTO<MovieDTO>> {
    const query = MovieQuery.create({
      ...input,
      status: input.status as MovieStatusEnum | undefined,
      ageRating: input.ageRating as AgeRatingEnum | undefined,
      userId: input.onlyMine ? userId : undefined
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
