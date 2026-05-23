import type { PgBoss } from "pg-boss";
import { QueueName } from "@/application/interfaces/providers";
import { queueWorkerConfig } from "@/infrastructure/queue";
import { makeStorageProvider } from "@/main/factories/providers";
import { makeNotificationService } from "@/main/factories/services";

export async function registerWorkers(boss: PgBoss): Promise<void> {
  const notificationService = makeNotificationService();
  const storageProvider = makeStorageProvider();

  const options = {
    pollingIntervalSeconds: queueWorkerConfig.pollingIntervalSeconds
  };

  await boss.work<{ to: string; token: string }>(
    QueueName.PASSWORD_RESET_EMAIL,
    options,
    async ([job]) => {
      await notificationService.sendPasswordResetEmail({
        ...job.data,
        idempotencyKey: job.id
      });
    }
  );

  await boss.work<{ to: string; movieTitle: string; releaseDate: string }>(
    QueueName.MOVIE_RELEASE_DATE,
    options,
    async ([job]) => {
      await notificationService.sendMovieReleaseDateEmail({
        ...job.data,
        idempotencyKey: job.id
      });
    }
  );

  await boss.work<{ to: string }>(
    QueueName.WELCOME_EMAIL,
    options,
    async ([job]) => {
      await notificationService.sendWelcomeEmail({
        ...job.data,
        idempotencyKey: job.id
      });
    }
  );

  await boss.work<{ key: string }>(
    QueueName.STORAGE_FILE_DELETE,
    options,
    async ([job]) => {
      await storageProvider.deleteFile(job.data.key);
    }
  );
}
