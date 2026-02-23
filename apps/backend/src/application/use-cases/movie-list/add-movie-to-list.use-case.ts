import type { AddMovieToListDTO } from "@repo/dtos";
import type { MovieListRepository, MovieRepository } from "@/application/interfaces/repositories";
import { MovieListNotFoundError, MovieNotFoundError, UnauthorizedError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class AddMovieToList {
  constructor(
    private readonly movieListRepository: MovieListRepository,
    private readonly movieRepository: MovieRepository
  ) {}

  async execute(listId: string, userId: string, input: AddMovieToListDTO): Promise<void> {
    const listUuid = Uuid.create(listId);
    const userUuid = Uuid.create(userId);
    const movieUuid = Uuid.create(input.movieId);

    const list = await this.movieListRepository.findById(listUuid);
    if (!list) throw new MovieListNotFoundError();
    if (list.userId.toString() !== userUuid.toString()) throw new UnauthorizedError();

    if (!(await this.movieRepository.exists(movieUuid))) throw new MovieNotFoundError();

    await this.movieListRepository.addMovie(listUuid, movieUuid);
  }
}
