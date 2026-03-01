import type { MovieDTO, UpdateMovieDTO } from "@repo/dtos";
import type { MovieRepository } from "@/application/interfaces/repositories";
import { MovieMapper } from "@/application/mappers";
import { MovieNotFoundError } from "@/domain/errors";
import {
  AgeRating,
  MovieStatus,
  NonNegativeInt,
  NonNegativeNumber,
  Url,
  Uuid
} from "@/domain/value-objects";

export class UpdateMovie {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(uuid: string, userId: string, input: UpdateMovieDTO): Promise<MovieDTO> {
    const id = Uuid.create(uuid);
    const userUuid = Uuid.create(userId);

    const data = {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.originalTitle !== undefined && {
        originalTitle: input.originalTitle
      }),
      ...(input.tagline !== undefined && { tagline: input.tagline }),
      ...(input.synopsis !== undefined && { synopsis: input.synopsis }),
      ...(input.releaseDate !== undefined && {
        releaseDate: input.releaseDate
      }),
      ...(input.runtime !== undefined && {
        runtime: NonNegativeInt.create(input.runtime)
      }),
      ...(input.status !== undefined && {
        status: MovieStatus.create(input.status)
      }),
      ...(input.ageRating !== undefined && {
        ageRating: AgeRating.create(input.ageRating)
      }),
      ...(input.languageId !== undefined && {
        languageId: Uuid.create(input.languageId)
      }),
      ...(input.budget !== undefined && {
        budget: NonNegativeNumber.create(input.budget)
      }),
      ...(input.revenue !== undefined && {
        revenue: NonNegativeNumber.create(input.revenue)
      }),
      ...(input.posterUrl !== undefined && {
        posterUrl: Url.create(input.posterUrl)
      }),
      ...(input.backdropUrl !== undefined && {
        backdropUrl: Url.create(input.backdropUrl)
      }),
      ...(input.trailerUrl !== undefined && {
        trailerUrl: Url.create(input.trailerUrl)
      }),
      ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
      updatedAt: new Date()
    };

    const updated = await this.movieRepository.updateByIdAndUserId(id, userUuid, data);
    if (!updated) {
      throw new MovieNotFoundError();
    }
    return MovieMapper.toDTO(updated);
  }
}
