import { ValidateToken } from "@/application/use-cases/auth";
import { JwtTokenProvider } from "@/infra/providers";
import { env } from "@/infra/config/env";

export function makeValidateToken(): ValidateToken {
  return new ValidateToken(
    new JwtTokenProvider(env.ACCESS_TOKEN_SECRET)
  );
}
