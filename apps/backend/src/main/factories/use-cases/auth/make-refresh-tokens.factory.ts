import { RefreshTokens } from "@/application/use-cases/auth";
import {
  makeUserRepository,
  makeRefreshTokenRepository
} from "@/main/factories/repositories";
import {
  makeTokenProvider,
  makeTransactionManager
} from "@/main/factories/providers";
import { env } from "@/infrastructure/config/env.config";
import type { StringValue } from "ms";

export function makeRefreshTokens(): RefreshTokens {
  return new RefreshTokens(
    makeUserRepository(),
    makeRefreshTokenRepository(),
    makeTokenProvider(),
    makeTransactionManager(),
    {
      accessTokenExpiresIn: env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
      refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN as StringValue
    }
  );
}
