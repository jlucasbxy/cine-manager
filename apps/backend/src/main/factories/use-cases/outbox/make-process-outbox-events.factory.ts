import { ProcessOutboxEvents } from "@/application/use-cases/outbox";
import { outboxEventWorkerConfig } from "@/infrastructure/config/worker-env.config";
import {
  makeStorageProvider,
  makeTransactionManager
} from "@/main/factories/providers";
import { makeNotificationService } from "@/main/factories/services";

export function makeProcessOutboxEvents(): ProcessOutboxEvents {
  return new ProcessOutboxEvents(
    makeTransactionManager(),
    makeNotificationService(),
    makeStorageProvider(),
    {
      batchSize: outboxEventWorkerConfig.batchSize,
      maxRetries: outboxEventWorkerConfig.maxRetries
    }
  );
}
