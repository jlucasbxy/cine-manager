import type {
  StorageProvider,
  TransactionManager
} from "@/application/interfaces/providers";
import type { NotificationService } from "@/application/interfaces/services";
import type { OutboxEvent } from "@/domain/entities";
import { OutboxEventTypeEnum } from "@/domain/enums";

interface ProcessOutboxEventsConfig {
  batchSize: number;
  maxRetries: number;
}

export class ProcessOutboxEvents {
  constructor(
    private readonly transactionManager: TransactionManager,
    private readonly notificationService: NotificationService,
    private readonly storageProvider: StorageProvider,
    private readonly config: ProcessOutboxEventsConfig
  ) {}

  async execute(): Promise<void> {
    const entries = await this.transactionManager.execute(async (repos) => {
      return repos.outboxEventRepository.findPendingBatch(
        this.config.batchSize
      );
    });

    for (const entry of entries) {
      await this.processEntry(entry);
    }
  }

  private async processEntry(entry: OutboxEvent): Promise<void> {
    try {
      await this.dispatch(entry);
      await this.transactionManager.execute(async (repos) => {
        await repos.outboxEventRepository.update(entry.markAsProcessed());
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      await this.transactionManager.execute(async (repos) => {
        await repos.outboxEventRepository.update(
          entry.retryCount + 1 >= this.config.maxRetries
            ? entry.markAsFailed(errorMessage)
            : entry.recordFailure(errorMessage)
        );
      });
    }
  }

  private async dispatch(entry: OutboxEvent): Promise<void> {
    switch (entry.type) {
      case OutboxEventTypeEnum.PASSWORD_RESET_EMAIL:
        await this.notificationService.sendPasswordResetEmail({
          ...(entry.payload as { to: string; token: string }),
          idempotencyKey: entry.id.toString()
        });
        break;
      case OutboxEventTypeEnum.MOVIE_RELEASE_DATE:
        await this.notificationService.sendMovieReleaseDateEmail({
          ...(entry.payload as {
            to: string;
            movieTitle: string;
            releaseDate: string;
          }),
          idempotencyKey: entry.id.toString()
        });
        break;
      case OutboxEventTypeEnum.WELCOME_EMAIL:
        await this.notificationService.sendWelcomeEmail({
          ...(entry.payload as { to: string }),
          idempotencyKey: entry.id.toString()
        });
        break;
      case OutboxEventTypeEnum.STORAGE_FILE_DELETE:
        await this.storageProvider.deleteFile(
          (entry.payload as { key: string }).key
        );
        break;
      default:
        throw new Error(`Unknown outbox event type: ${entry.type}`);
    }
  }
}
