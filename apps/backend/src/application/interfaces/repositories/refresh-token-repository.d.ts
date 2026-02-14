import { RefreshToken } from "@/domain/entities";
import { Token, Uuid } from "@/domain/value-objects";

export interface UpdateRefreshTokenData {
  revokedAt?: Date | null;
}

export interface RefreshTokenRepository {
  create(token: RefreshToken): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  updateByToken(token: Token, data: UpdateRefreshTokenData): Promise<void>;
  updateManyByUserId(userId: Uuid, data: UpdateRefreshTokenData): Promise<void>;
  deleteExpired(): Promise<void>;
}
