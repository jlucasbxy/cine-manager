import type { FastifyPluginAsync } from "fastify";
import type { MovieListController } from "@/infrastructure/http/controllers";
import type { AuthMiddleware } from "@/infrastructure/http/middlewares";

interface MovieListRoutesOptions {
  movieListController: MovieListController;
  authMiddleware: AuthMiddleware;
}

export const movieListRoutes: FastifyPluginAsync<MovieListRoutesOptions> = async (
  fastify,
  opts
) => {
  const { movieListController, authMiddleware } = opts;

  fastify.addHook("preHandler", authMiddleware.preHandler);

  fastify.post("/", movieListController.createList.bind(movieListController));
  fastify.get("/", movieListController.getLists.bind(movieListController));
  fastify.get("/:id", movieListController.getList.bind(movieListController));
  fastify.put("/:id", movieListController.updateList.bind(movieListController));
  fastify.delete("/:id", movieListController.deleteList.bind(movieListController));
  fastify.post("/:id/movies", movieListController.addMovie.bind(movieListController));
  fastify.delete("/:id/movies/:movieId", movieListController.removeMovie.bind(movieListController));
};
