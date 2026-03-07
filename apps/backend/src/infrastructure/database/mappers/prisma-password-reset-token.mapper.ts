import { PasswordResetToken } from "@/domain/entities";
import { Token, Uuid } from "@/domain/value-objects";
import type { PasswordResetTokenModel } from "@/infrastructure/database/prisma/generated/prisma/models/PasswordResetToken";

export const PrismaPasswordResetTokenMapper = {
  toDomain(raw: PasswordResetTokenModel): PasswordResetToken {
    return PasswordResetToken.reconstitute({
      id: Uuid.reconstitute(raw.id),
      token: Token.reconstitute(raw.token),
      userId: Uuid.reconstitute(raw.userId),
      expiresAt: raw.expiresAt,
      usedAt: raw.usedAt,
      createdAt: raw.createdAt
    });
  }
};
