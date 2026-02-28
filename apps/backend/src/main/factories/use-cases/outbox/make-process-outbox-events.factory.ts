import { ProcessOutboxEvents } from "@/application/use-cases/outbox";
import { outboxEventWorkerConfig } from "@/infrastructure/config/worker-env.config";
import { makeStorageProvider } from "@/main/factories/providers";
import { makeOutboxEventRepository } from "@/main/factories/repositories";
import { makeNotificationService } from "@/main/factories/services";

export function makeProcessOutboxEvents(): ProcessOutboxEvents {
  return new ProcessOutboxEvents(
    makeOutboxEventRepository(),
    makeNotificationService(),
    makeStorageProvider(),
    {
      batchSize: outboxEventWorkerConfig.batchSize,
      maxRetries: outboxEventWorkerConfig.maxRetries
    }
  );
}
