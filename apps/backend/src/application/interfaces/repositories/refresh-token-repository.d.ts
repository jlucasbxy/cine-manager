import { Uuid } from "@/domain/value-objects";

export type RefreshTokenData = {
  id: Uuid;
  token: string;
  userId: Uuid;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

export type CreateRefreshTokenData = {
  token: string;
  userId: Uuid;
  expiresAt: Date;
};

export interface RefreshTokenRepository {
  create(data: CreateRefreshTokenData): Promise<RefreshTokenData>;
  findByToken(token: string): Promise<RefreshTokenData | null>;
  revokeByToken(token: string): Promise<void>;
  revokeAllByUserId(userId: Uuid): Promise<void>;
  deleteExpired(): Promise<void>;
}
