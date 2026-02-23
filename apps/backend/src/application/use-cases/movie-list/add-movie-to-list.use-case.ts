import type { AddMovieToListDTO } from "@repo/dtos";
import type { TransactionManager } from "@/application/interfaces/providers";
import { MovieListNotFoundError, MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class AddMovieToList {
  constructor(private readonly transactionManager: TransactionManager) {}

  async execute(listId: string, userId: string, input: AddMovieToListDTO): Promise<void> {
    const listUuid = Uuid.create(listId);
    const userUuid = Uuid.create(userId);
    const movieUuid = Uuid.create(input.movieId);

    await this.transactionManager.execute(async (repos) => {
      if (!(await repos.movieListRepository.existsByIdAndUserIdForUpdate(listUuid, userUuid))) throw new MovieListNotFoundError();

      if (!(await repos.movieRepository.existsForUpdate(movieUuid))) throw new MovieNotFoundError();

      await repos.movieListRepository.addMovie(listUuid, movieUuid);
    });
  }
}
