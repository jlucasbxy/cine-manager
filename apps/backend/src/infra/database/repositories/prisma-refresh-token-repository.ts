import type {
  RefreshTokenRepository,
  RefreshTokenData,
  CreateRefreshTokenData,
} from "@/application/interfaces/repositories";
import { Uuid } from "@/domain/value-objects";
import { prisma } from "@/infra/database/prisma";

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  async create(data: CreateRefreshTokenData): Promise<RefreshTokenData> {
    const raw = await prisma.refreshToken.create({
      data: {
        token: data.token,
        userId: data.userId.toString(),
        expiresAt: data.expiresAt,
      },
    });
    return {
      id: Uuid.reconstitute(raw.id),
      token: raw.token,
      userId: Uuid.reconstitute(raw.userId),
      expiresAt: raw.expiresAt,
      revokedAt: raw.revokedAt,
      createdAt: raw.createdAt,
    };
  }

  async findByToken(token: string): Promise<RefreshTokenData | null> {
    const raw = await prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!raw) return null;
    return {
      id: Uuid.reconstitute(raw.id),
      token: raw.token,
      userId: Uuid.reconstitute(raw.userId),
      expiresAt: raw.expiresAt,
      revokedAt: raw.revokedAt,
      createdAt: raw.createdAt,
    };
  }

  async revokeByToken(token: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
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
