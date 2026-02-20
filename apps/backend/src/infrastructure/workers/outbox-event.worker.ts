import type { ProcessOutboxEvents } from "@/application/use-cases/outbox";

interface OutboxEventWorkerConfig {
  pollIntervalMs: number;
}

export class OutboxEventWorker {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly processOutbox: ProcessOutboxEvents,
    private readonly config: OutboxEventWorkerConfig
  ) {}

  start(): void {
    this.intervalId = setInterval(async () => {
      try {
        await this.processOutbox.execute();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(
          "[OutboxEventWorker] Error processing outbox:",
          err
        );
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
