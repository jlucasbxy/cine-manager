import type { MovieRepository } from "@/application/interfaces/repositories";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class DeleteMovie {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(uuid: string): Promise<void> {
    const id = Uuid.create(uuid);

    const deleted = await this.movieRepository.delete(id);
    if (!deleted) {
      throw new MovieNotFoundError();
    }
  }
}
