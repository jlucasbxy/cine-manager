import { Login } from "@/application/use-cases/auth";
import {
  makeUserRepository,
  makeRefreshTokenRepository
} from "@/main/factories/repositories";
import {
  makeHashProvider,
  makeTokenProvider
} from "@/main/factories/providers";
import { env } from "@/infrastructure/config/env.config";
import type { StringValue } from "ms";

export function makeLogin(): Login {
  return new Login(
    makeUserRepository(),
    makeRefreshTokenRepository(),
    makeHashProvider(),
    makeTokenProvider(),
    {
      accessTokenExpiresIn: env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
      refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN as StringValue
    }
  );
}
