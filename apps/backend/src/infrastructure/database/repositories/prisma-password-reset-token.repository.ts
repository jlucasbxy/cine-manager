import type { PasswordResetTokenRepository } from "@/application/interfaces/repositories";
import type { PasswordResetToken } from "@/domain/entities";
import type { Token, Uuid } from "@/domain/value-objects";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";
import { PrismaPasswordResetTokenMapper } from "@/infrastructure/database/mappers";

export class PrismaPasswordResetTokenRepository
  implements PasswordResetTokenRepository
{
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

  async findByToken(token: Token): Promise<PasswordResetToken | null> {
    const raw = await this.db.passwordResetToken.findUnique({
      where: { token: token.toString() }
    });
    if (!raw) return null;
    return PrismaPasswordResetTokenMapper.toDomain(raw);
  }

  async update(token: PasswordResetToken): Promise<void> {
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
