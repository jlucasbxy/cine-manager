import type { MovieListRepository } from "@/application/interfaces/repositories";
import { UnauthorizedError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class DeleteMovieList {
  constructor(private readonly movieListRepository: MovieListRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const listUuid = Uuid.create(id);
    const userUuid = Uuid.create(userId);

    if (!(await this.movieListRepository.delete(listUuid, userUuid))) throw new UnauthorizedError();
  }
}
