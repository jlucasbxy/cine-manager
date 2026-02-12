import type { FastifyPluginAsync } from "fastify";
import type { UserController } from "@/infrastructure/http/controllers";
import { RATE_LIMITS } from "@/infrastructure/config/rate-limit.config";

interface UserRoutesOptions {
  userController: UserController;
}

export const userRoutes: FastifyPluginAsync<UserRoutesOptions> = async (
  fastify,
  opts
) => {
  const { userController } = opts;

  fastify.post("/", {
    config: { rateLimit: RATE_LIMITS.registration },
    handler: userController.createUser.bind(userController)
  });
};
