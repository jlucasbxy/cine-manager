import type { ProcessNotificationOutbox } from "@/application/use-cases/notification";

interface NotificationOutboxWorkerConfig {
  pollIntervalMs: number;
}

export class NotificationOutboxWorker {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly processOutbox: ProcessNotificationOutbox,
    private readonly config: NotificationOutboxWorkerConfig
  ) {}

  start(): void {
    this.intervalId = setInterval(async () => {
      try {
        await this.processOutbox.execute();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[NotificationOutboxWorker] Error processing outbox:", err);
      }
    }, this.config.pollIntervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
