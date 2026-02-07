import type { FastifyPluginAsync } from "fastify";
import type { UserController } from "@/infra/http/controllers";

interface UserRoutesOptions {
  userController: UserController;
}

export const userRoutes: FastifyPluginAsync<UserRoutesOptions> = async (fastify, opts) => {
  const { userController } = opts;

  fastify.post("/", userController.createUser.bind(userController));
};
