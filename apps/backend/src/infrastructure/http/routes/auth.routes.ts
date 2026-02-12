import type { FastifyPluginAsync } from "fastify";
import type { AuthController } from "@/infrastructure/http/controllers";
import { RATE_LIMITS } from "@/infrastructure/config/rate-limit.config";

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
  fastify.post("/logout", authController.logout.bind(authController));
  fastify.post("/refresh", authController.refreshTokens.bind(authController));
  fastify.post("/password-reset/request", {
    config: { rateLimit: RATE_LIMITS.passwordResetRequest },
    handler: authController.requestPasswordReset.bind(authController)
  });
  fastify.post(
    "/password-reset/reset",
    authController.resetPassword.bind(authController)
  );
};
