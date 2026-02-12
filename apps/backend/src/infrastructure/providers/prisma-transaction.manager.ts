import type {
  TransactionManager,
  TransactionRepositories
} from "@/application/interfaces/providers";

import type { PrismaClient } from "@/infrastructure/database/prisma/generated/prisma/client";
import {
  PrismaMovieRepository,
  PrismaUserRepository,
  PrismaRefreshTokenRepository,
  PrismaPasswordResetTokenRepository,
  PrismaNotificationOutboxRepository,
  PrismaLanguageRepository,
  PrismaGenreRepository
} from "@/infrastructure/database/repositories";

export class PrismaTransactionManager implements TransactionManager {
  constructor(private readonly db: PrismaClient) {}

  async execute<T>(
    fn: (repos: TransactionRepositories) => Promise<T>
  ): Promise<T> {
    return this.db.$transaction(async (tx) => {
      const repos: TransactionRepositories = {
        movieRepository: new PrismaMovieRepository(tx),
        userRepository: new PrismaUserRepository(tx),
        refreshTokenRepository: new PrismaRefreshTokenRepository(tx),
        passwordResetTokenRepository: new PrismaPasswordResetTokenRepository(
          tx
        ),
        notificationOutboxRepository: new PrismaNotificationOutboxRepository(
          tx
        ),
        languageRepository: new PrismaLanguageRepository(tx),
        genreRepository: new PrismaGenreRepository(tx)
      };
      return fn(repos);
    });
  }
}
