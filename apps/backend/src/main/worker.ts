/* eslint-disable no-console */
import { notificationOutboxWorkerConfig } from "@/infrastructure/config/worker-env";
import { makePrismaClient } from "@/main/prisma";
import { PrismaNotificationOutboxRepository } from "@/infrastructure/database/repositories";
import { ResendEmailProvider } from "@/infrastructure/providers";
import { NotificationServiceImpl } from "@/infrastructure/services";
import { SendPasswordResetEmail, ProcessNotificationOutbox } from "@/application/use-cases/notification";
import { NotificationOutboxWorker } from "@/infrastructure/workers";

export function startWorker() {
  const emailProvider = new ResendEmailProvider();
  const sendPasswordResetEmail = new SendPasswordResetEmail(emailProvider);
  const notificationService = new NotificationServiceImpl(sendPasswordResetEmail);

  const outboxRepository = new PrismaNotificationOutboxRepository(makePrismaClient());
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
}
