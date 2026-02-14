import { RefreshTokens } from "@/application/use-cases/auth";
import {
  makeTokenProvider,
  makeTransactionManager
} from "@/main/factories/providers";
import { env } from "@/infrastructure/config/env.config";
import type { StringValue } from "ms";

export function makeRefreshTokens(): RefreshTokens {
  return new RefreshTokens(
    makeTokenProvider(),
    makeTransactionManager(),
    {
      accessTokenExpiresIn: env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
      refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN as StringValue
    }
  );
}
