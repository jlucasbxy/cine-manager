import type { PasswordResetTokenModel } from "@/infra/database/prisma/generated/prisma/models/PasswordResetToken";
import { PasswordResetToken } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects";

export class PrismaPasswordResetTokenMapper {
  static toDomain(raw: PasswordResetTokenModel): PasswordResetToken {
    return PasswordResetToken.reconstitute({
      id: Uuid.reconstitute(raw.id),
      token: raw.token,
      userId: Uuid.reconstitute(raw.userId),
      expiresAt: raw.expiresAt,
      usedAt: raw.usedAt,
      createdAt: raw.createdAt
    });
  }
}
