import { env } from "@/infra/config/env";

export const notificationOutboxWorkerConfig = {
  pollIntervalMs: env.NOTIFICATION_OUTBOX_POLL_INTERVAL_MS,
  batchSize: env.NOTIFICATION_OUTBOX_BATCH_SIZE,
  maxRetries: env.NOTIFICATION_OUTBOX_MAX_RETRIES
};
