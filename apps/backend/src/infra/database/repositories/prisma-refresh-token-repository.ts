import type { RefreshTokenRepository } from "@/application/interfaces/repositories";
import { RefreshToken } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects";
import { prisma } from "@/infra/database/prisma";

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  async create(token: RefreshToken): Promise<RefreshToken> {
    const raw = await prisma.refreshToken.create({
      data: {
        id: token.id.toString(),
        token: token.token,
        userId: token.userId.toString(),
        expiresAt: token.expiresAt,
        revokedAt: token.revokedAt,
        createdAt: token.createdAt,
      },
    });
    return RefreshToken.reconstitute({
      id: Uuid.reconstitute(raw.id),
      token: raw.token,
      userId: Uuid.reconstitute(raw.userId),
      expiresAt: raw.expiresAt,
      revokedAt: raw.revokedAt,
      createdAt: raw.createdAt,
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const raw = await prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!raw) return null;
    return RefreshToken.reconstitute({
      id: Uuid.reconstitute(raw.id),
      token: raw.token,
      userId: Uuid.reconstitute(raw.userId),
      expiresAt: raw.expiresAt,
      revokedAt: raw.revokedAt,
      createdAt: raw.createdAt,
    });
  }

  async revoke(token: RefreshToken): Promise<void> {
    await prisma.refreshToken.update({
      where: { id: token.id.toString() },
      data: { revokedAt: token.revokedAt },
    });
  }

  async revokeAllByUserId(userId: Uuid): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        userId: userId.toString(),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  async deleteExpired(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}
