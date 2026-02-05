import type { PasswordResetTokenRepository } from "@/application/interfaces/repositories";
import { PasswordResetToken } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects";
import { prisma } from "@/infra/database/prisma";

export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {
  async create(token: PasswordResetToken): Promise<PasswordResetToken> {
    const raw = await prisma.passwordResetToken.create({
      data: {
        id: token.id.toString(),
        token: token.token,
        userId: token.userId.toString(),
        expiresAt: token.expiresAt,
        usedAt: token.usedAt,
        createdAt: token.createdAt,
      },
    });
    return PasswordResetToken.reconstitute({
      id: Uuid.reconstitute(raw.id),
      token: raw.token,
      userId: Uuid.reconstitute(raw.userId),
      expiresAt: raw.expiresAt,
      usedAt: raw.usedAt,
      createdAt: raw.createdAt,
    });
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const raw = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    if (!raw) return null;
    return PasswordResetToken.reconstitute({
      id: Uuid.reconstitute(raw.id),
      token: raw.token,
      userId: Uuid.reconstitute(raw.userId),
      expiresAt: raw.expiresAt,
      usedAt: raw.usedAt,
      createdAt: raw.createdAt,
    });
  }

  async markAsUsed(token: PasswordResetToken): Promise<void> {
    await prisma.passwordResetToken.update({
      where: { id: token.id.toString() },
      data: { usedAt: token.usedAt },
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
