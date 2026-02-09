import { AuthMiddleware } from "@/infrastructure/http/middlewares";
import { JwtTokenProvider } from "@/infrastructure/providers";
import { env } from "@/infrastructure/config/env";

export function makeAuthMiddleware(): AuthMiddleware {
  return new AuthMiddleware(
    new JwtTokenProvider(env.ACCESS_TOKEN_SECRET)
  );
}
