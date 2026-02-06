import type { TransactionManager, TransactionRepositories } from "@/application/interfaces/providers";
import { prisma } from "@/infra/database/prisma";
import { PrismaPasswordResetTokenRepository } from "@/infra/database/repositories";
import { PrismaNotificationOutboxRepository } from "@/infra/database/repositories";

export class PrismaTransactionManager implements TransactionManager {
  async execute<T>(fn: (repos: TransactionRepositories) => Promise<T>): Promise<T> {
    return prisma.$transaction(async (tx) => {
      const repos: TransactionRepositories = {
        passwordResetTokenRepository: new PrismaPasswordResetTokenRepository(tx),
        notificationOutboxRepository: new PrismaNotificationOutboxRepository(tx)
      };
      return fn(repos);
    });
  }
}
