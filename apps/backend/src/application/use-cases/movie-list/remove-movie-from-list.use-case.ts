import type { TransactionManager } from "@/application/interfaces/providers";
import { MovieListNotFoundError, UnauthorizedError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class RemoveMovieFromList {
  constructor(private readonly transactionManager: TransactionManager) {}

  async execute(listId: string, movieId: string, userId: string): Promise<void> {
    const listUuid = Uuid.create(listId);
    const userUuid = Uuid.create(userId);
    const movieUuid = Uuid.create(movieId);

    await this.transactionManager.execute(async (repos) => {
      const list = await repos.movieListRepository.findById(listUuid);
      if (!list) throw new MovieListNotFoundError();
      if (list.userId.toString() !== userUuid.toString()) throw new UnauthorizedError();

      await repos.movieListRepository.removeMovieByListIdAndMovieId(listUuid, movieUuid);
    });
  }
}
