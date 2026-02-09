import type { FastifyPluginAsync } from "fastify";
import type { GenreController } from "@/infrastructure/http/controllers";
import type { AuthMiddleware } from "@/infrastructure/http/middlewares";

interface GenreRoutesOptions {
  genreController: GenreController;
  authMiddleware: AuthMiddleware;
}

export const genreRoutes: FastifyPluginAsync<GenreRoutesOptions> = async (
  fastify,
  opts
) => {
  const { genreController, authMiddleware } = opts;

  fastify.addHook("preHandler", authMiddleware.preHandler);

  fastify.get("/", genreController.listGenres.bind(genreController));
};
