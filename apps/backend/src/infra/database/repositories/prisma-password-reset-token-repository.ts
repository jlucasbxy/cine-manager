import type { PasswordResetTokenRepository } from "@/application/interfaces/repositories";
import { PasswordResetToken } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects";
import type { PrismaDatabase } from "@/infra/database/prisma";
import { PrismaPasswordResetTokenMapper } from "@/infra/database/mappers";

export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async create(token: PasswordResetToken): Promise<PasswordResetToken> {
    const raw = await this.db.passwordResetToken.create({
      data: {
        id: token.id.toString(),
        token: token.token.toString(),
        userId: token.userId.toString(),
        expiresAt: token.expiresAt,
        usedAt: token.usedAt,
        createdAt: token.createdAt
      }
    });
    return PrismaPasswordResetTokenMapper.toDomain(raw);
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const raw = await this.db.passwordResetToken.findUnique({
      where: { token }
    });
    if (!raw) return null;
    return PrismaPasswordResetTokenMapper.toDomain(raw);
  }

  async markAsUsed(token: PasswordResetToken): Promise<void> {
    await this.db.passwordResetToken.update({
      where: { id: token.id.toString() },
      data: { usedAt: token.usedAt }
    });
  }

  async deleteExpired(): Promise<void> {
    await this.db.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
  }

  async deleteByUserId(userId: Uuid): Promise<void> {
    await this.db.passwordResetToken.deleteMany({
      where: { userId: userId.toString() }
    });
  }
}
