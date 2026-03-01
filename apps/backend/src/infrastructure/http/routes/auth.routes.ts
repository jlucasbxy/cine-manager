import type { FastifyPluginAsync } from "fastify";
import { RATE_LIMITS } from "@/infrastructure/config/rate-limit.config";
import type { AuthController } from "@/infrastructure/http/controllers";

interface AuthRoutesOptions {
  authController: AuthController;
}

export const authRoutes: FastifyPluginAsync<AuthRoutesOptions> = async (
  fastify,
  opts
) => {
  const { authController } = opts;

  fastify.post("/login", {
    config: { rateLimit: RATE_LIMITS.login },
    handler: authController.login.bind(authController)
  });
  fastify.post("/logout", {
    config: { rateLimit: RATE_LIMITS.logout },
    handler: authController.logout.bind(authController)
  });
  fastify.post("/refresh", {
    config: { rateLimit: RATE_LIMITS.refresh },
    handler: authController.refreshTokens.bind(authController)
  });
  fastify.post("/password-reset/request", {
    config: { rateLimit: RATE_LIMITS.passwordResetRequest },
    handler: authController.requestPasswordReset.bind(authController)
  });
  fastify.post("/password-reset/reset", {
    config: { rateLimit: RATE_LIMITS.passwordResetExecute },
    handler: authController.resetPassword.bind(authController)
  });
};
