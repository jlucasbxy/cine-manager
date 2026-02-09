import type { FastifyPluginAsync } from "fastify";
import type { MovieController } from "@/infrastructure/http/controllers";
import type { AuthMiddleware } from "@/infrastructure/http/middlewares";

interface MovieRoutesOptions {
  movieController: MovieController;
  authMiddleware: AuthMiddleware;
}

export const movieRoutes: FastifyPluginAsync<MovieRoutesOptions> = async (fastify, opts) => {
  const { movieController, authMiddleware } = opts;

  fastify.addHook("preHandler", authMiddleware.preHandler);

  fastify.post("/", movieController.createMovie.bind(movieController));
  fastify.get("/", movieController.listMovies.bind(movieController));
  fastify.get("/:id", movieController.getMovie.bind(movieController));
  fastify.put("/:id", movieController.updateMovie.bind(movieController));
  fastify.delete("/:id", movieController.deleteMovie.bind(movieController));
};
