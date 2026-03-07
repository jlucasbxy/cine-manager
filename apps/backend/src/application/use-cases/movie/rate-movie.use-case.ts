import type { MovieDTO, RateMovieDTO } from "@repo/dtos";
import type { TransactionManager } from "@/application/interfaces/providers";
import { MovieMapper } from "@/application/mappers";
import { Rating } from "@/domain/entities";
import { MovieNotFoundError } from "@/domain/errors";
import {
  NonNegativeDecimal,
  NonNegativeInt,
  RatingValue,
  Uuid
} from "@/domain/value-objects";

export class RateMovie {
  constructor(private readonly transactionManager: TransactionManager) {}

  async execute(
    movieId: string,
    userId: string,
    input: RateMovieDTO
  ): Promise<MovieDTO> {
    const movieUuid = Uuid.create(movieId);
    const userUuid = Uuid.create(userId);
    const ratingValue = RatingValue.create(input.value);

    const updated = await this.transactionManager.execute(async (repos) => {
      const movie = await repos.movieRepository.findByIdForUpdate(movieUuid);
      if (!movie) throw new MovieNotFoundError();

      const rating = await repos.ratingRepository.upsert(
        Rating.create({
          userId: userUuid,
          movieId: movieUuid,
          value: ratingValue
        })
      );
      if (!rating) throw new MovieNotFoundError();

      const { average, count } =
        await repos.ratingRepository.getAverageAndCount(movieUuid);

      return repos.movieRepository.update(movieUuid, {
        votes: NonNegativeInt.create(count),
        score: NonNegativeDecimal.create(Math.round(average * 10) / 10)
      });
    });

    return MovieMapper.toDTO(updated!);
  }
}
