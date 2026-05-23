import { QueueName } from "@/application/interfaces/providers";
import { queueWorkerConfig } from "@/infrastructure/queue";
import {
  makeLogProvider,
  makeStorageProvider
} from "@/main/factories/providers";
import { startPgBoss, stopPgBoss } from "@/main/factories/queue";
import { makeNotificationService } from "@/main/factories/services";

export async function startWorker(): Promise<void> {
  const logProvider = makeLogProvider().child({ context: "worker" });
  const notificationService = makeNotificationService();
  const storageProvider = makeStorageProvider();

  const boss = await startPgBoss();

  boss.on("error", (error) => {
    logProvider.error("pg-boss error", { error: String(error) });
  });

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

  async function shutdown(): Promise<void> {
    logProvider.info("Shutting down...");
    await stopPgBoss();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  logProvider.info("Worker started, processing queues...");
}
