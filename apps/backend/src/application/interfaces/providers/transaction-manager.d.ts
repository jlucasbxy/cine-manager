import type { PasswordResetTokenRepository } from "@/application/interfaces/repositories";
import type { NotificationOutboxRepository } from "@/application/interfaces/repositories";

export interface TransactionRepositories {
  passwordResetTokenRepository: PasswordResetTokenRepository;
  notificationOutboxRepository: NotificationOutboxRepository;
}

export interface TransactionManager {
  execute<T>(fn: (repos: TransactionRepositories) => Promise<T>): Promise<T>;
}
