import { Login } from "@/application/use-cases/auth";
import { makeUserRepository, makeRefreshTokenRepository } from "@/main/factories/repositories";
import { BcryptHashProvider, JwtTokenProvider } from "@/infrastructure/providers";
import { env } from "@/infrastructure/config/env";
import type { StringValue } from "ms";

export function makeLogin(): Login {
  return new Login(
    makeUserRepository(),
    makeRefreshTokenRepository(),
    new BcryptHashProvider(),
    new JwtTokenProvider(env.ACCESS_TOKEN_SECRET),
    {
      accessTokenExpiresIn: env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
      refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN as StringValue
    }
  );
}
