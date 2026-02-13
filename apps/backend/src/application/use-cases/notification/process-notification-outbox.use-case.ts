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

    const grouped = this.groupByType(entries);

    for (const [type, group] of grouped) {
      await this.dispatchBatch(type, group);
    }
  }

  private groupByType(
    entries: NotificationOutbox[]
  ): Map<NotificationTypeEnum, NotificationOutbox[]> {
    const map = new Map<NotificationTypeEnum, NotificationOutbox[]>();

    for (const entry of entries) {
      const group = map.get(entry.type);
      if (group) {
        group.push(entry);
      } else {
        map.set(entry.type, [entry]);
      }
    }

    return map;
  }

  private async dispatchBatch(
    type: NotificationTypeEnum,
    entries: NotificationOutbox[]
  ): Promise<void> {
    try {
      switch (type) {
        case NotificationTypeEnum.PASSWORD_RESET_EMAIL:
          await this.notificationService.sendPasswordResetEmailBatch(
            entries.map(
              (e) => e.payload as { to: string; token: string }
            )
          );
          break;
        default:
          throw new Error(`Unknown notification type: ${type}`);
      }

      await Promise.all(
        entries.map((entry) =>
          this.repository.update(entry.markAsProcessed())
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      await Promise.all(
        entries.map((entry) => {
          const updated =
            entry.retryCount + 1 >= this.config.maxRetries
              ? entry.markAsFailed(errorMessage)
              : entry.recordFailure(errorMessage);

          return this.repository.update(updated);
        })
      );
    }
  }
}
