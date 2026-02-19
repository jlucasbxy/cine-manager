import type { StringValue } from "ms";
import { RequestPasswordReset } from "@/application/use-cases/auth";
import { env } from "@/infrastructure/config/env.config";
import { makeTransactionManager } from "@/main/factories/providers";

export function makeRequestPasswordReset(): RequestPasswordReset {
  return new RequestPasswordReset(makeTransactionManager(), {
    passwordResetTokenExpiresIn:
      env.PASSWORD_RESET_TOKEN_EXPIRES_IN as StringValue
  });
}
