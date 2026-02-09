import { ValidateToken } from "@/application/use-cases/auth";
import { JwtTokenProvider } from "@/infrastructure/providers";
import { env } from "@/infrastructure/config/env";

export function makeValidateToken(): ValidateToken {
  return new ValidateToken(
    new JwtTokenProvider(env.ACCESS_TOKEN_SECRET)
  );
}
