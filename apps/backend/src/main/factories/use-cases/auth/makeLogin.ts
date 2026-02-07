import { Login } from "@/application/use-cases/auth";
import { makeUserRepository, makeRefreshTokenRepository } from "@/main/factories/repositories";
import { BcryptHashProvider, JwtTokenProvider } from "@/infra/providers";
import { env } from "@/infra/config/env";
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
