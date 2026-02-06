/* eslint-disable no-console */
import { notificationOutboxWorkerConfig } from "@/infra/config/worker-env";
import { PrismaNotificationOutboxRepository } from "@/infra/database/repositories";
import { ResendEmailProvider } from "@/infra/providers";
import { NotificationServiceImpl } from "@/infra/services";
import { SendPasswordResetEmail, ProcessNotificationOutbox } from "@/application/use-cases/notification";
import { NotificationOutboxWorker } from "@/infra/workers";

const emailProvider = new ResendEmailProvider();
const sendPasswordResetEmail = new SendPasswordResetEmail(emailProvider);
const notificationService = new NotificationServiceImpl(sendPasswordResetEmail);

const outboxRepository = new PrismaNotificationOutboxRepository();
const processOutbox = new ProcessNotificationOutbox(outboxRepository, notificationService, {
  batchSize: notificationOutboxWorkerConfig.batchSize,
  maxRetries: notificationOutboxWorkerConfig.maxRetries
});

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
