import type { FastifyPluginAsync } from "fastify";
import type { LanguageController } from "@/infra/http/controllers";
import type { AuthMiddleware } from "@/infra/http/middlewares";

interface LanguageRoutesOptions {
  languageController: LanguageController;
  authMiddleware: AuthMiddleware;
}

export const languageRoutes: FastifyPluginAsync<LanguageRoutesOptions> = async (fastify, opts) => {
  const { languageController, authMiddleware } = opts;

  fastify.addHook("preHandler", authMiddleware.preHandler);

  fastify.get("/", languageController.listLanguages.bind(languageController));
};
