import { Uuid } from "@/domain/value-objects";

export type PasswordResetTokenData = {
  id: Uuid;
  token: string;
  userId: Uuid;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};

export type CreatePasswordResetTokenData = {
  token: string;
  userId: Uuid;
  expiresAt: Date;
};

export interface PasswordResetTokenRepository {
  create(data: CreatePasswordResetTokenData): Promise<PasswordResetTokenData>;
  findByToken(token: string): Promise<PasswordResetTokenData | null>;
  markAsUsed(token: string): Promise<void>;
  deleteExpired(): Promise<void>;
  deleteByUserId(userId: Uuid): Promise<void>;
}
