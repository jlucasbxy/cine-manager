import { Movie } from "@/domain/entities";
import { AgeRating } from "@/domain/enums/age-rating.enum";
import { MovieStatus } from "@/domain/enums/movie-status.enum";
import { NonNegativeInt } from "@/domain/value-objects/non-negative-int.value-object";
import { NonNegativeNumber } from "@/domain/value-objects/non-negative-number.value-object";
import { Url } from "@/domain/value-objects/url.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";
import { MovieRepository } from "@/application/interfaces/repositories/movie-repository";
import { CreateMovieDTO } from "@repo/dtos";

export class CreateMovie {
  constructor(
    private readonly movieRepository: MovieRepository
  ) { }

  async execute(input: CreateMovieDTO): Promise<Movie> {
    const movie = Movie.create({
      title: input.title,
      originalTitle: input.originalTitle,
      tagline: input.tagline,
      synopsis: input.synopsis,
      releaseDate: input.releaseDate,
      runtime: NonNegativeInt.create(input.runtime),
      status: input.status as MovieStatus,
      ageRating: input.ageRating as AgeRating,
      languageId: Uuid.create(input.languageId),
      budget: NonNegativeNumber.create(input.budget),
      revenue: NonNegativeNumber.create(input.revenue),
      posterUrl: Url.create(input.posterUrl),
      backdropUrl: Url.create(input.backdropUrl),
      trailerUrl: Url.create(input.trailerUrl),
      userId: Uuid.create(input.userId)
    });

    return this.movieRepository.create(movie);
  }
}
