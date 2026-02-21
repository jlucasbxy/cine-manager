import type { MovieListDTO, UpdateMovieListDTO } from "@repo/dtos";
import { MovieListMapper } from "@/application/mappers/movie-list.mapper";
import type { MovieListRepository } from "@/application/interfaces/repositories";
import { MovieListNotFoundError, UnauthorizedError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class UpdateMovieList {
  constructor(private readonly movieListRepository: MovieListRepository) {}

  async execute(id: string, userId: string, input: UpdateMovieListDTO): Promise<MovieListDTO> {
    const listUuid = Uuid.create(id);
    const userUuid = Uuid.create(userId);

    const list = await this.movieListRepository.findById(listUuid);
    if (!list) throw new MovieListNotFoundError();
    if (list.userId.toString() !== userUuid.toString()) throw new UnauthorizedError();

    const updated = await this.movieListRepository.update(listUuid, input.name);
    if (!updated) throw new MovieListNotFoundError();

    return MovieListMapper.toDTO(updated);
  }
}
