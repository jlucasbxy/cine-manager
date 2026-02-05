import type { RefreshTokenModel } from "@/infra/database/prisma/generated/prisma/models/RefreshToken";
import { RefreshToken } from "@/domain/entities";
import { Token, Uuid } from "@/domain/value-objects";

export class PrismaRefreshTokenMapper {
  static toDomain(raw: RefreshTokenModel): RefreshToken {
    return RefreshToken.reconstitute({
      id: Uuid.reconstitute(raw.id),
      token: Token.reconstitute(raw.token),
      userId: Uuid.reconstitute(raw.userId),
      expiresAt: raw.expiresAt,
      revokedAt: raw.revokedAt,
      createdAt: raw.createdAt
    });
  }
}
