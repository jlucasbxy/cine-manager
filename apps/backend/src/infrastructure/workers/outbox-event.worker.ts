import type { LogProvider } from "@/application/interfaces/providers";
import type { ProcessOutboxEvents } from "@/application/use-cases/outbox";

interface OutboxEventWorkerConfig {
  pollIntervalMs: number;
}

export class OutboxEventWorker {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly processOutbox: ProcessOutboxEvents,
    private readonly config: OutboxEventWorkerConfig,
    private readonly logProvider: LogProvider
  ) {}

  start(): void {
    this.intervalId = setInterval(async () => {
      try {
        await this.processOutbox.execute();
      } catch (err) {
        this.logProvider.error("Error processing outbox", {
          error: String(err)
        });
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
