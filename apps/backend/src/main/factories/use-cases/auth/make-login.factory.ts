import { Login } from "@/application/use-cases/auth";
import {
  makeHashProvider,
  makeTokenProvider,
  makeTransactionManager
} from "@/main/factories/providers";
import { env } from "@/infrastructure/config/env.config";
import type { StringValue } from "ms";

export function makeLogin(): Login {
  return new Login(
    makeTransactionManager(),
    makeHashProvider(),
    makeTokenProvider(),
    {
      accessTokenExpiresIn: env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
      refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN as StringValue
    }
  );
}
