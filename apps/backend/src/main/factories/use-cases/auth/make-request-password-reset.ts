import { RequestPasswordReset } from "@/application/use-cases/auth";
import { makeUserRepository } from "@/main/factories/repositories";
import { makeTransactionManager } from "@/main/factories/providers";
import { env } from "@/infrastructure/config/env";
import type { StringValue } from "ms";

export function makeRequestPasswordReset(): RequestPasswordReset {
  return new RequestPasswordReset(
    makeUserRepository(),
    makeTransactionManager(),
    {
      passwordResetTokenExpiresIn:
        env.PASSWORD_RESET_TOKEN_EXPIRES_IN as StringValue
    }
  );
}
