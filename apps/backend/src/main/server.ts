import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { env } from "@/infra/config/env";
import { ROUTE_PREFIXES } from "@/infra/config/routes";
import { errorHandler } from "@/infra/http/middlewares";
import { authRoutes, genreRoutes, languageRoutes, movieRoutes, userRoutes } from "@/infra/http/routes";
import { makeAuthController, makeGenreController, makeLanguageController, makeMovieController, makeUserController } from "@/main/factories/controllers";
import { makeAuthMiddleware } from "@/main/factories/middlewares";

export async function start() {
  const app = Fastify({
    logger: true
  });

  await app.register(cors);
  await app.register(cookie);

  app.setErrorHandler(errorHandler);

  const authController = makeAuthController();
  const genreController = makeGenreController();
  const languageController = makeLanguageController();
  const movieController = makeMovieController();
  const userController = makeUserController();
  const authMiddleware = makeAuthMiddleware();

  await app.register(authRoutes, { prefix: ROUTE_PREFIXES.auth, authController });
  await app.register(genreRoutes, { prefix: ROUTE_PREFIXES.genres, genreController, authMiddleware });
  await app.register(languageRoutes, { prefix: ROUTE_PREFIXES.languages, languageController, authMiddleware });
  await app.register(movieRoutes, { prefix: ROUTE_PREFIXES.movies, movieController, authMiddleware });
  await app.register(userRoutes, { prefix: ROUTE_PREFIXES.users, userController });

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
