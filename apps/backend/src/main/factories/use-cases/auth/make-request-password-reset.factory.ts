import { RequestPasswordReset } from "@/application/use-cases/auth";
import { makeTransactionManager } from "@/main/factories/providers";
import { env } from "@/infrastructure/config/env.config";
import type { StringValue } from "ms";

export function makeRequestPasswordReset(): RequestPasswordReset {
  return new RequestPasswordReset(makeTransactionManager(), {
    passwordResetTokenExpiresIn:
      env.PASSWORD_RESET_TOKEN_EXPIRES_IN as StringValue
  });
}
