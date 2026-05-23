import { QueueName } from "@/application/interfaces/providers";

export interface QueueDefinition {
  name: QueueName;
  retryLimit: number;
  retryDelay: number;
  retryBackoff: boolean;
}

export const QUEUE_DEFINITIONS: QueueDefinition[] = [
  QueueName.PASSWORD_RESET_EMAIL,
  QueueName.MOVIE_RELEASE_DATE,
  QueueName.WELCOME_EMAIL,
  QueueName.STORAGE_FILE_DELETE
].map((name) => ({
  name,
  retryLimit: 3,
  retryDelay: 5,
  retryBackoff: true
}));

export const deadLetterName = (name: QueueName): string => `${name}-dlq`;

export const queueWorkerConfig = {
  pollingIntervalSeconds: 2
};
