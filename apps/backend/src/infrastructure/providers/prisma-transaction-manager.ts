import type { TransactionManager, TransactionRepositories } from "@/application/interfaces/providers";
 
import type { PrismaClient } from "@/infrastructure/database/prisma/generated/prisma/client";
import { PrismaPasswordResetTokenRepository } from "@/infrastructure/database/repositories";
import { PrismaNotificationOutboxRepository } from "@/infrastructure/database/repositories";

export class PrismaTransactionManager implements TransactionManager {
  constructor(private readonly db: PrismaClient) {}

  async execute<T>(fn: (repos: TransactionRepositories) => Promise<T>): Promise<T> {
    return this.db.$transaction(async (tx) => {
      const repos: TransactionRepositories = {
        passwordResetTokenRepository: new PrismaPasswordResetTokenRepository(tx),
        notificationOutboxRepository: new PrismaNotificationOutboxRepository(tx)
      };
      return fn(repos);
    });
  }
}
