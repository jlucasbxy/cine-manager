import { AgeRating, MovieStatus, NonNegativeInt, NonNegativeNumber, Url, Uuid } from "@/domain/value-objects";
import { MovieNotFoundError } from "@/domain/errors";
import type { MovieRepository } from "@/application/interfaces/repositories";
import { MovieMapper } from "@/application/mappers";
import type { UpdateMovieDTO, MovieDTO } from "@repo/dtos";

export class UpdateMovie {
  constructor(
    private readonly movieRepository: MovieRepository
  ) { }

  async execute(uuid: string, input: UpdateMovieDTO): Promise<MovieDTO> {
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
      ...(input.status !== undefined && { status: MovieStatus.create(input.status) }),
      ...(input.ageRating !== undefined && { ageRating: AgeRating.create(input.ageRating) }),
      ...(input.languageId !== undefined && { languageId: Uuid.create(input.languageId) }),
      ...(input.budget !== undefined && { budget: NonNegativeNumber.create(input.budget) }),
      ...(input.revenue !== undefined && { revenue: NonNegativeNumber.create(input.revenue) }),
      ...(input.posterUrl !== undefined && { posterUrl: Url.create(input.posterUrl) }),
      ...(input.backdropUrl !== undefined && { backdropUrl: Url.create(input.backdropUrl) }),
      ...(input.trailerUrl !== undefined && { trailerUrl: Url.create(input.trailerUrl) }),
      updatedAt: new Date()
    };

    const updated = await this.movieRepository.update(id, data);
    return MovieMapper.toDTO(updated);
  }
}
