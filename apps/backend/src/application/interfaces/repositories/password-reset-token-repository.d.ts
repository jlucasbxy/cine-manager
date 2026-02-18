import { PasswordResetToken } from "@/domain/entities";
import { Token, Uuid } from "@/domain/value-objects";

export interface PasswordResetTokenRepository {
  create(token: PasswordResetToken): Promise<PasswordResetToken>;
  findByToken(token: Token): Promise<PasswordResetToken | null>;
  update(token: PasswordResetToken): Promise<void>;
  deleteExpired(): Promise<void>;
  deleteByUserId(userId: Uuid): Promise<void>;
}
