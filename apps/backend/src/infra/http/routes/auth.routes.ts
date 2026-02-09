import type { FastifyPluginAsync } from "fastify";
import type { AuthController } from "@/infra/http/controllers";

interface AuthRoutesOptions {
  authController: AuthController;
}

export const authRoutes: FastifyPluginAsync<AuthRoutesOptions> = async (fastify, opts) => {
  const { authController } = opts;

  fastify.post("/login", authController.login.bind(authController));
  fastify.post("/logout", authController.logout.bind(authController));
  fastify.post("/refresh", authController.refreshTokens.bind(authController));
  fastify.post("/password-reset/request", authController.requestPasswordReset.bind(authController));
  fastify.post("/password-reset/reset", authController.resetPassword.bind(authController));
};
