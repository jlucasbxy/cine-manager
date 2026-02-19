import type { FastifyPluginAsync } from "fastify";
import { RATE_LIMITS } from "@/infrastructure/config/rate-limit.config";
import type { UserController } from "@/infrastructure/http/controllers";
import type { AuthMiddleware } from "@/infrastructure/http/middlewares";

interface UserRoutesOptions {
  userController: UserController;
  authMiddleware: AuthMiddleware;
}

export const userRoutes: FastifyPluginAsync<UserRoutesOptions> = async (
  fastify,
  opts
) => {
  const { userController, authMiddleware } = opts;

  fastify.post("/", {
    config: { rateLimit: RATE_LIMITS.registration },
    handler: userController.createUser.bind(userController)
  });

  fastify.get("/me", {
    preHandler: authMiddleware.preHandler,
    handler: userController.getMe.bind(userController)
  });

  fastify.patch("/", {
    preHandler: authMiddleware.preHandler,
    handler: userController.updateUser.bind(userController)
  });
};
