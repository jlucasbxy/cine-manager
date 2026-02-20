/* eslint-disable no-console */
import { outboxEventWorkerConfig } from "@/infrastructure/config/worker-env.config";
import { OutboxEventWorker } from "@/infrastructure/workers";
import { makeProcessOutboxEvents } from "@/main/factories/use-cases/outbox";

export function startWorker() {
  const processOutbox = makeProcessOutboxEvents();

  const worker = new OutboxEventWorker(processOutbox, {
    pollIntervalMs: outboxEventWorkerConfig.pollIntervalMs
  });

  function shutdown() {
    console.log("[Worker] Shutting down...");
    worker.stop();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  console.log("[Worker] Starting outbox event worker...");
  worker.start();
}
