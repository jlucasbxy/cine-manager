import type { MovieListDTO } from "@repo/dtos";
import { MovieListMapper } from "@/application/mappers/movie-list.mapper";
import type { MovieListRepository } from "@/application/interfaces/repositories";
import { MovieListNotFoundError, UnauthorizedError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class GetMovieList {
  constructor(private readonly movieListRepository: MovieListRepository) {}

  async execute(id: string, userId: string): Promise<MovieListDTO> {
    const listUuid = Uuid.create(id);
    const userUuid = Uuid.create(userId);

    const list = await this.movieListRepository.findByIdWithMovies(listUuid);
    if (!list) throw new MovieListNotFoundError();
    if (list.userId.toString() !== userUuid.toString()) throw new UnauthorizedError();

    return MovieListMapper.toDTOWithMovies(list);
  }
}
