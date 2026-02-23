import type { PasswordResetTokenRepository } from "@/application/interfaces/repositories";
import type { PasswordResetToken } from "@/domain/entities";
import type { Token, Uuid } from "@/domain/value-objects";
import { PrismaPasswordResetTokenMapper } from "@/infrastructure/database/mappers";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";
import type { PasswordResetTokenModel } from "@/infrastructure/database/prisma/generated/prisma/models/PasswordResetToken";

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

  async findByTokenForUpdate(token: Token): Promise<PasswordResetToken | null> {
    const results = await this.db.$queryRaw<PasswordResetTokenModel[]>`
      SELECT id, token, "userId", "expiresAt", "usedAt", "createdAt" FROM "PasswordResetToken" WHERE token = ${token.toString()} FOR UPDATE
    `;
    if (!results[0]) return null;
    return PrismaPasswordResetTokenMapper.toDomain(results[0]);
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
