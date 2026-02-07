import { AuthMiddleware } from "@/infra/http/middlewares";
import { JwtTokenProvider } from "@/infra/providers";
import { env } from "@/infra/config/env";

export function makeAuthMiddleware(): AuthMiddleware {
  return new AuthMiddleware(
    new JwtTokenProvider(env.ACCESS_TOKEN_SECRET)
  );
}
