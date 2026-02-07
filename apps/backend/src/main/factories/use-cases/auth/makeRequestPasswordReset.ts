import { RequestPasswordReset } from "@/application/use-cases/auth";
import { makeUserRepository } from "@/main/factories/repositories";
import { PrismaTransactionManager } from "@/infra/providers";
import { env } from "@/infra/config/env";
import type { StringValue } from "ms";

export function makeRequestPasswordReset(): RequestPasswordReset {
  return new RequestPasswordReset(
    makeUserRepository(),
    new PrismaTransactionManager(),
    {
      passwordResetTokenExpiresIn: env.PASSWORD_RESET_TOKEN_EXPIRES_IN as StringValue
    }
  );
}
