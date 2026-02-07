import { RequestPasswordReset } from "@/application/use-cases/auth";
import { PrismaUserRepository } from "@/infra/database/repositories";
import { PrismaTransactionManager } from "@/infra/providers";
import { env } from "@/infra/config/env";
import type { StringValue } from "ms";

export function makeRequestPasswordReset(): RequestPasswordReset {
  return new RequestPasswordReset(
    new PrismaUserRepository(),
    new PrismaTransactionManager(),
    {
      passwordResetTokenExpiresIn: env.PASSWORD_RESET_TOKEN_EXPIRES_IN as StringValue
    }
  );
}
