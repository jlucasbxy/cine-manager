import { RefreshToken } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects";

export interface RefreshTokenRepository {
  create(token: RefreshToken): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revoke(token: RefreshToken): Promise<void>;
  revokeAllByUserId(userId: Uuid): Promise<void>;
  deleteExpired(): Promise<void>;
}
