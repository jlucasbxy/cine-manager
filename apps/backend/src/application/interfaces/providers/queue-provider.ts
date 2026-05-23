export const QueueName = {
  PASSWORD_RESET_EMAIL: "password-reset-email",
  MOVIE_RELEASE_DATE: "movie-release-date",
  WELCOME_EMAIL: "welcome-email",
  STORAGE_FILE_DELETE: "storage-file-delete"
} as const;

export type QueueName = (typeof QueueName)[keyof typeof QueueName];

export interface EnqueueOptions {
  id?: string;
  startAfter?: Date;
}

export interface QueueProvider {
  send(
    name: QueueName,
    data: Record<string, unknown>,
    options?: EnqueueOptions
  ): Promise<void>;
  cancel(name: QueueName, id: string): Promise<void>;
}
