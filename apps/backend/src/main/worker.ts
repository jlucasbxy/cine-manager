import { outboxEventWorkerConfig } from "@/infrastructure/config/worker-env.config";
import { OutboxEventWorker } from "@/infrastructure/workers";
import { makeLogProvider } from "@/main/factories/providers";
import { makeProcessOutboxEvents } from "@/main/factories/use-cases/outbox";

export function startWorker() {
  const logProvider = makeLogProvider().child({ context: "worker" });
  const processOutbox = makeProcessOutboxEvents();

  const worker = new OutboxEventWorker(
    processOutbox,
    { pollIntervalMs: outboxEventWorkerConfig.pollIntervalMs },
    logProvider
  );

  function shutdown() {
    logProvider.info("Shutting down...");
    worker.stop();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  logProvider.info("Starting outbox event worker...");
  worker.start();
}
