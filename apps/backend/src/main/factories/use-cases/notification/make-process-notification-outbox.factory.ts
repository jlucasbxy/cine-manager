import { ProcessNotificationOutbox } from "@/application/use-cases/notification";
import { makeNotificationOutboxRepository } from "@/main/factories/repositories";
import { makeNotificationService } from "@/main/factories/services";
import { notificationOutboxWorkerConfig } from "@/infrastructure/config/worker-env.config";

export function makeProcessNotificationOutbox(): ProcessNotificationOutbox {
  return new ProcessNotificationOutbox(
    makeNotificationOutboxRepository(),
    makeNotificationService(),
    {
      batchSize: notificationOutboxWorkerConfig.batchSize,
      maxRetries: notificationOutboxWorkerConfig.maxRetries
    }
  );
}
