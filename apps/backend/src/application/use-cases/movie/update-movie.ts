import { Movie } from "@/domain/entities";
import { AgeRating } from "@/domain/enums/age-rating.enum";
import { MovieStatus } from "@/domain/enums/movie-status.enum";
import { NonNegativeInt } from "@/domain/value-objects/non-negative-int.value-object";
import { NonNegativeNumber } from "@/domain/value-objects/non-negative-number.value-object";
import { Url } from "@/domain/value-objects/url.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";
import { MovieNotFoundError } from "@/domain/errors/movie-not-found.error";
import { MovieRepository } from "@/application/interfaces/repositories/movie-repository";
import { UpdateMovieDTO } from "@repo/dtos";

export class UpdateMovie {
  constructor(
    private readonly movieRepository: MovieRepository
  ) { }

  async execute(uuid: string, input: UpdateMovieDTO): Promise<Movie> {
    const id = Uuid.create(uuid);

    const existingMovie = await this.movieRepository.findById(id);
    if (!existingMovie) {
      throw new MovieNotFoundError();
    }

    const data = {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.originalTitle !== undefined && { originalTitle: input.originalTitle }),
      ...(input.tagline !== undefined && { tagline: input.tagline }),
      ...(input.synopsis !== undefined && { synopsis: input.synopsis }),
      ...(input.releaseDate !== undefined && { releaseDate: input.releaseDate }),
      ...(input.runtime !== undefined && { runtime: NonNegativeInt.create(input.runtime) }),
      ...(input.status !== undefined && { status: input.status as MovieStatus }),
      ...(input.ageRating !== undefined && { ageRating: input.ageRating as AgeRating }),
      ...(input.languageId !== undefined && { languageId: Uuid.create(input.languageId) }),
      ...(input.budget !== undefined && { budget: NonNegativeNumber.create(input.budget) }),
      ...(input.revenue !== undefined && { revenue: NonNegativeNumber.create(input.revenue) }),
      ...(input.posterUrl !== undefined && { posterUrl: Url.create(input.posterUrl) }),
      ...(input.backdropUrl !== undefined && { backdropUrl: Url.create(input.backdropUrl) }),
      ...(input.trailerUrl !== undefined && { trailerUrl: Url.create(input.trailerUrl) })
    };

    return this.movieRepository.update(id, data);
  }
}
