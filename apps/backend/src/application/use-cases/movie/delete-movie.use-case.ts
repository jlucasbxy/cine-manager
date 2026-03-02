import type { TransactionManager } from "@/application/interfaces/providers";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class DeleteMovie {
  constructor(private readonly transactionManager: TransactionManager) {}

  async execute(uuid: string, userId: string): Promise<void> {
    const id = Uuid.create(uuid);
    const userUuid = Uuid.create(userId);

    await this.transactionManager.execute(async (repos) => {
      await repos.outboxEventRepository.deletePendingByResourceId(id);

      const deleted = await repos.movieRepository.deleteByIdAndUserId(
        id,
        userUuid
      );
      if (!deleted) {
        throw new MovieNotFoundError();
      }
      await repos.movieRepository.hardDeleteIfSoftDeletedAndOrphan(id);
    });
  }
}
