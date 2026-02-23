import type { MovieListRepository } from "@/application/interfaces/repositories";
import { MovieListNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class RemoveMovieFromList {
  constructor(private readonly movieListRepository: MovieListRepository) {}

  async execute(listId: string, movieId: string, userId: string): Promise<void> {
    const listUuid = Uuid.create(listId);
    const userUuid = Uuid.create(userId);
    const movieUuid = Uuid.create(movieId);

    const found = await this.movieListRepository.removeMovieByListIdAndMovieId(listUuid, userUuid, movieUuid);
    if (!found) throw new MovieListNotFoundError();
  }
}
