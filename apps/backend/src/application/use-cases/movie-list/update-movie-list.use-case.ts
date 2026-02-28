import type { MovieListDTO, UpdateMovieListDTO } from "@repo/dtos";
import type { MovieListRepository } from "@/application/interfaces/repositories";
import { MovieListMapper } from "@/application/mappers/movie-list.mapper";
import { MovieListNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class UpdateMovieList {
  constructor(private readonly movieListRepository: MovieListRepository) {}

  async execute(
    id: string,
    userId: string,
    input: UpdateMovieListDTO
  ): Promise<MovieListDTO> {
    const listUuid = Uuid.create(id);
    const userUuid = Uuid.create(userId);

    const updated = await this.movieListRepository.updateByIdAndUserId(
      listUuid,
      userUuid,
      input.name
    );
    if (!updated) throw new MovieListNotFoundError();

    return MovieListMapper.toDTO(updated);
  }
}
