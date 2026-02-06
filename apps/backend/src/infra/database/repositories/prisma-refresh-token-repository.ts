import type { RefreshTokenRepository } from "@/application/interfaces/repositories";
import { RefreshToken } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects";
import { prisma } from "@/infra/database/prisma";
import { PrismaRefreshTokenMapper } from "@/infra/database/mappers";
import type { TransactionClient } from "@/infra/database/prisma/generated/prisma/internal/prismaNamespace";

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  private readonly db: typeof prisma | TransactionClient;

  constructor(client?: TransactionClient) {
    this.db = client ?? prisma;
  }

  async create(token: RefreshToken): Promise<RefreshToken> {
    const raw = await this.db.refreshToken.create({
      data: {
        id: token.id.toString(),
        token: token.token.toString(),
        userId: token.userId.toString(),
        expiresAt: token.expiresAt,
        revokedAt: token.revokedAt,
        createdAt: token.createdAt
      }
    });
    return PrismaRefreshTokenMapper.toDomain(raw);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const raw = await this.db.refreshToken.findUnique({
      where: { token }
    });
    if (!raw) return null;
    return PrismaRefreshTokenMapper.toDomain(raw);
  }

  async revoke(token: RefreshToken): Promise<void> {
    await this.db.refreshToken.update({
      where: { id: token.id.toString() },
      data: { revokedAt: token.revokedAt }
    });
  }

  async revokeAllByUserId(userId: Uuid): Promise<void> {
    await this.db.refreshToken.updateMany({
      where: {
        userId: userId.toString(),
        revokedAt: null
      },
      data: { revokedAt: new Date() }
    });
  }

  async deleteExpired(): Promise<void> {
    await this.db.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
  }
}
