import type { MovieRepository } from "@/application/interfaces/repositories";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class DeleteMovie {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(uuid: string, userId: string): Promise<void> {
    const id = Uuid.create(uuid);
    const userUuid = Uuid.create(userId);

    const deleted = await this.movieRepository.deleteByIdAndUserId(id, userUuid);
    if (!deleted) {
      throw new MovieNotFoundError();
    }
  }
}
