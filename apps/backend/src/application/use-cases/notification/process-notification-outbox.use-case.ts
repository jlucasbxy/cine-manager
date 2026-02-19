import type { NotificationOutboxRepository } from "@/application/interfaces/repositories";
import type { NotificationService } from "@/application/interfaces/services";
import type { NotificationOutbox } from "@/domain/entities";
import { NotificationTypeEnum } from "@/domain/enums";

interface ProcessNotificationOutboxConfig {
  batchSize: number;
  maxRetries: number;
}

export class ProcessNotificationOutbox {
  constructor(
    private readonly repository: NotificationOutboxRepository,
    private readonly notificationService: NotificationService,
    private readonly config: ProcessNotificationOutboxConfig
  ) {}

  async execute(): Promise<void> {
    const entries = await this.repository.findPendingBatch(
      this.config.batchSize
    );

    for (const entry of entries) {
      await this.processEntry(entry);
    }
  }

  private async processEntry(entry: NotificationOutbox): Promise<void> {
    try {
      await this.dispatch(entry);
      await this.repository.update(entry.markAsProcessed());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      await this.repository.update(
        entry.retryCount + 1 >= this.config.maxRetries
          ? entry.markAsFailed(errorMessage)
          : entry.recordFailure(errorMessage)
      );
    }
  }

  private async dispatch(entry: NotificationOutbox): Promise<void> {
    switch (entry.type) {
      case NotificationTypeEnum.PASSWORD_RESET_EMAIL:
        await this.notificationService.sendPasswordResetEmail({
          ...(entry.payload as { to: string; token: string }),
          idempotencyKey: entry.id.toString()
        });
        break;
      case NotificationTypeEnum.MOVIE_RELEASE_DATE:
        await this.notificationService.sendMovieReleaseDateEmail({
          ...(entry.payload as {
            to: string;
            movieTitle: string;
            releaseDate: string;
          }),
          idempotencyKey: entry.id.toString()
        });
        break;
      case NotificationTypeEnum.WELCOME_EMAIL:
        await this.notificationService.sendWelcomeEmail({
          ...(entry.payload as { to: string }),
          idempotencyKey: entry.id.toString()
        });
        break;
      default:
        throw new Error(`Unknown notification type: ${entry.type}`);
    }
  }
}
