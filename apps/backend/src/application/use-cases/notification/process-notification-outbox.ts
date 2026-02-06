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
    const entries = await this.repository.findPendingBatch(this.config.batchSize);

    for (const entry of entries) {
      await this.processEntry(entry);
    }
  }

  private async processEntry(entry: NotificationOutbox): Promise<void> {
    try {
      await this.dispatch(entry);
      const processed = entry.markAsProcessed();
      await this.repository.update(processed);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      const updated =
        entry.retryCount + 1 >= this.config.maxRetries
          ? entry.markAsFailed(errorMessage)
          : entry.recordFailure(errorMessage);

      await this.repository.update(updated);
    }
  }

  private async dispatch(entry: NotificationOutbox): Promise<void> {
    switch (entry.type) {
      case NotificationTypeEnum.PASSWORD_RESET_EMAIL:
        await this.notificationService.sendPasswordResetEmail(
          entry.payload as { to: string; token: string }
        );
        break;
      default:
        throw new Error(`Unknown notification type: ${entry.type}`);
    }
  }
}
