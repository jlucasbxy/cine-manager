import type {
  PasswordResetTokenRepository,
  PasswordResetTokenData,
  CreatePasswordResetTokenData,
} from "@/application/interfaces/repositories";
import { Uuid } from "@/domain/value-objects";
import { prisma } from "@/infra/database/prisma";

export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {
  async create(data: CreatePasswordResetTokenData): Promise<PasswordResetTokenData> {
    const raw = await prisma.passwordResetToken.create({
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
      usedAt: raw.usedAt,
      createdAt: raw.createdAt,
    };
  }

  async findByToken(token: string): Promise<PasswordResetTokenData | null> {
    const raw = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    if (!raw) return null;
    return {
      id: Uuid.reconstitute(raw.id),
      token: raw.token,
      userId: Uuid.reconstitute(raw.userId),
      expiresAt: raw.expiresAt,
      usedAt: raw.usedAt,
      createdAt: raw.createdAt,
    };
  }

  async markAsUsed(token: string): Promise<void> {
    await prisma.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() },
    });
  }

  async deleteExpired(): Promise<void> {
    await prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }

  async deleteByUserId(userId: Uuid): Promise<void> {
    await prisma.passwordResetToken.deleteMany({
      where: { userId: userId.toString() },
    });
  }
}
