import type { CreateMovieDTO, MovieDTO } from "@repo/dtos";
import type { TransactionManager } from "@/application/interfaces/providers";
import { MovieMapper } from "@/application/mappers";
import { Movie, NotificationOutbox } from "@/domain/entities";
import { NotificationTypeEnum } from "@/domain/enums";
import {
  AgeRating,
  MovieStatus,
  NonNegativeInt,
  NonNegativeNumber,
  Url,
  Uuid
} from "@/domain/value-objects";

export class CreateMovie {
  constructor(private readonly transactionManager: TransactionManager) {}

  async execute(userId: string, input: CreateMovieDTO): Promise<MovieDTO> {
    const userUuid = Uuid.create(userId);

    const movie = Movie.create({
      title: input.title,
      originalTitle: input.originalTitle,
      tagline: input.tagline,
      synopsis: input.synopsis,
      releaseDate: input.releaseDate,
      runtime: NonNegativeInt.create(input.runtime),
      status: MovieStatus.create(input.status),
      ageRating: AgeRating.create(input.ageRating),
      languageId: Uuid.create(input.languageId),
      budget: NonNegativeNumber.create(input.budget),
      revenue: NonNegativeNumber.create(input.revenue),
      posterUrl: Url.create(input.posterUrl),
      backdropUrl: Url.create(input.backdropUrl),
      trailerUrl: Url.create(input.trailerUrl),
      userId: userUuid
    });

    const created = await this.transactionManager.execute(async (repos) => {
      const savedMovie = await repos.movieRepository.create(movie);

      if (movie.releaseDate > new Date()) {
        const user = await repos.userRepository.findById(userUuid);
        if (user) {
          const outboxEntry = NotificationOutbox.create({
            type: NotificationTypeEnum.MOVIE_RELEASE_DATE,
            payload: {
              to: user.email.toString(),
              movieTitle: movie.title,
              releaseDate: movie.releaseDate.toISOString()
            },
            movieId: movie.id,
            scheduledFor: movie.releaseDate
          });
          await repos.notificationOutboxRepository.create(outboxEntry);
        }
      }

      return savedMovie;
    });

    return MovieMapper.toDTO(created);
  }
}
