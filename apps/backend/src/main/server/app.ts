import Fastify from "fastify";
import cors from "@fastify/cors";
import { errorHandler } from "@/infra/http/middlewares";
import { authRoutes, movieRoutes, userRoutes } from "@/infra/http/routes";
import { makeAuthController, makeMovieController, makeUserController } from "@/main/factories/controllers";
import { makeAuthMiddleware } from "@/main/factories/middlewares";

export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  await app.register(cors);

  app.setErrorHandler(errorHandler);

  const authController = makeAuthController();
  const movieController = makeMovieController();
  const userController = makeUserController();
  const authMiddleware = makeAuthMiddleware();

  await app.register(authRoutes, { prefix: "/auth", authController });
  await app.register(movieRoutes, { prefix: "/movies", movieController, authMiddleware });
  await app.register(userRoutes, { prefix: "/users", userController });

  return app;
}
