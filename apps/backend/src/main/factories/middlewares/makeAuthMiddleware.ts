import { AuthMiddleware } from "@/infrastructure/http/middlewares";
import { makeTokenProvider } from "@/main/factories/providers";

export function makeAuthMiddleware(): AuthMiddleware {
  return new AuthMiddleware(makeTokenProvider());
}
