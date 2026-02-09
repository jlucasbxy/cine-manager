import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import { env } from "@/infrastructure/config/env";
import { makeRedisClient } from "@/main/factories/redis";
import { ROUTE_PREFIXES } from "@/infrastructure/config/routes";
import { ErrorCode } from "@repo/dtos";
import { errorHandler } from "@/infrastructure/http/middlewares";
import {
  authRoutes,
  genreRoutes,
  languageRoutes,
  movieRoutes,
  userRoutes
} from "@/infrastructure/http/routes";
import {
  makeAuthController,
  makeGenreController,
  makeLanguageController,
  makeMovieController,
  makeUserController
} from "@/main/factories/controllers";
import { makeAuthMiddleware } from "@/main/factories/middlewares";

export async function start() {
  const app = Fastify({
    logger: true
  });

  await app.register(cors);
  await app.register(cookie);
  const redis = makeRedisClient();

  await app.register(rateLimit, {
    global: false,
    redis,
    errorResponseBuilder: (_request, context) => ({
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message: `Too many requests. Please try again in ${context.after}.`
    })
  });

  app.setErrorHandler(errorHandler);

  const authController = makeAuthController();
  const genreController = makeGenreController();
  const languageController = makeLanguageController();
  const movieController = makeMovieController();
  const userController = makeUserController();
  const authMiddleware = makeAuthMiddleware();

  await app.register(authRoutes, {
    prefix: ROUTE_PREFIXES.auth,
    authController
  });
  await app.register(genreRoutes, {
    prefix: ROUTE_PREFIXES.genres,
    genreController,
    authMiddleware
  });
  await app.register(languageRoutes, {
    prefix: ROUTE_PREFIXES.languages,
    languageController,
    authMiddleware
  });
  await app.register(movieRoutes, {
    prefix: ROUTE_PREFIXES.movies,
    movieController,
    authMiddleware
  });
  await app.register(userRoutes, {
    prefix: ROUTE_PREFIXES.users,
    userController
  });

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
