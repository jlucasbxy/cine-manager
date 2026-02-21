import type { MovieListRepository } from "@/application/interfaces/repositories";
import { MovieListNotFoundError, UnauthorizedError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class DeleteMovieList {
  constructor(private readonly movieListRepository: MovieListRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const listUuid = Uuid.create(id);
    const userUuid = Uuid.create(userId);

    const list = await this.movieListRepository.findById(listUuid);
    if (!list) throw new MovieListNotFoundError();
    if (list.userId.toString() !== userUuid.toString()) throw new UnauthorizedError();

    await this.movieListRepository.delete(listUuid);
  }
}
