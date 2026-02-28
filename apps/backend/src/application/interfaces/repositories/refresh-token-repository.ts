import type { RefreshToken } from "@/domain/entities";
import type { Token, Uuid } from "@/domain/value-objects";

export type UpdateRefreshTokenData = Pick<RefreshToken, "revokedAt">;

export interface RefreshTokenRepository {
  create(token: RefreshToken): Promise<RefreshToken>;
  findByTokenForUpdate(token: Token): Promise<RefreshToken | null>;
  updateByToken(
    token: Token,
    data: UpdateRefreshTokenData
  ): Promise<RefreshToken | null>;
  updateManyByUserId(
    userId: Uuid,
    data: UpdateRefreshTokenData
  ): Promise<number | null>;
  deleteExpired(): Promise<void>;
}
