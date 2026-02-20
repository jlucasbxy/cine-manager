import { ProcessNotificationOutbox } from "@/application/use-cases/notification";
import { notificationOutboxWorkerConfig } from "@/infrastructure/config/worker-env.config";
import { makeNotificationOutboxRepository } from "@/main/factories/repositories";
import { makeStorageProvider } from "@/main/factories/providers";
import { makeNotificationService } from "@/main/factories/services";

export function makeProcessNotificationOutbox(): ProcessNotificationOutbox {
  return new ProcessNotificationOutbox(
    makeNotificationOutboxRepository(),
    makeNotificationService(),
    makeStorageProvider(),
    {
      batchSize: notificationOutboxWorkerConfig.batchSize,
      maxRetries: notificationOutboxWorkerConfig.maxRetries
    }
  );
}
