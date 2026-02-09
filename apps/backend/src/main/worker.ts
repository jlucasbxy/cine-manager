/* eslint-disable no-console */
import { notificationOutboxWorkerConfig } from "@/infrastructure/config/worker-env";
import { makeProcessNotificationOutbox } from "@/main/factories/use-cases/notification";
import { NotificationOutboxWorker } from "@/infrastructure/workers";

export function startWorker() {
  const processOutbox = makeProcessNotificationOutbox();

  const worker = new NotificationOutboxWorker(processOutbox, {
    pollIntervalMs: notificationOutboxWorkerConfig.pollIntervalMs
  });

  function shutdown() {
    console.log("[Worker] Shutting down...");
    worker.stop();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  console.log("[Worker] Starting notification outbox worker...");
  worker.start();
}
