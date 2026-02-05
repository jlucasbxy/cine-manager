import { Movie } from "@/domain/entities";
import { AgeRating, MovieStatus, NonNegativeInt, NonNegativeNumber, Url, Uuid } from "@/domain/value-objects";
import type { MovieRepository } from "@/application/interfaces/repositories";
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
      status: MovieStatus.create(input.status),
      ageRating: AgeRating.create(input.ageRating),
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
