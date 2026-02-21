import type { MovieListRepository } from "@/application/interfaces/repositories";
import { MovieListNotFoundError, UnauthorizedError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class RemoveMovieFromList {
  constructor(private readonly movieListRepository: MovieListRepository) {}

  async execute(listId: string, movieId: string, userId: string): Promise<void> {
    const listUuid = Uuid.create(listId);
    const userUuid = Uuid.create(userId);
    const movieUuid = Uuid.create(movieId);

    const list = await this.movieListRepository.findById(listUuid);
    if (!list) throw new MovieListNotFoundError();
    if (list.userId.toString() !== userUuid.toString()) throw new UnauthorizedError();

    await this.movieListRepository.removeMovie(listUuid, movieUuid);
  }
}
