import path from "path";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { ErrorCode } from "@repo/dtos";
import Fastify from "fastify";
import { env } from "@/infrastructure/config/env.config";
import { ROUTE_PREFIXES } from "@/infrastructure/config/routes.config";
import { errorHandler } from "@/infrastructure/http/middlewares";
import {
  authRoutes,
  genreRoutes,
  languageRoutes,
  movieListRoutes,
  movieRoutes,
  uploadRoutes,
  userRoutes
} from "@/infrastructure/http/routes";
import {
  makeAuthController,
  makeGenreController,
  makeLanguageController,
  makeMovieController,
  makeMovieListController,
  makeUploadController,
  makeUserController
} from "@/main/factories/controllers";
import { makeAuthMiddleware } from "@/main/factories/middlewares";
import { makeRedisClient } from "@/main/factories/redis";

export async function start() {
  const app = Fastify({
    logger: env.IS_DEVELOPMENT
      ? {
          transport: {
            target: "pino-pretty",
            options: { translateTime: "HH:MM:ss", ignore: "pid,hostname" }
          }
        }
      : true
  });

  if (!env.IS_PRODUCTION && env.ENABLE_DOCS) {
    await app.register(swagger, {
      mode: "static",
      specification: {
        path: path.join(process.cwd(), "swagger.yaml"),
        baseDir: process.cwd()
      }
    });

    await app.register(swaggerUi, {
      routePrefix: "/docs"
    });
  }

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
  const movieListController = makeMovieListController();
  const movieController = makeMovieController();
  const uploadController = makeUploadController();
  const userController = makeUserController();
  const authMiddleware = makeAuthMiddleware();

  await app.register(
    async (api) => {
      await api.register(authRoutes, {
        prefix: ROUTE_PREFIXES.auth,
        authController
      });
      await api.register(genreRoutes, {
        prefix: ROUTE_PREFIXES.genres,
        genreController,
        authMiddleware
      });
      await api.register(languageRoutes, {
        prefix: ROUTE_PREFIXES.languages,
        languageController,
        authMiddleware
      });
      await api.register(movieListRoutes, {
        prefix: ROUTE_PREFIXES.lists,
        movieListController,
        authMiddleware
      });
      await api.register(movieRoutes, {
        prefix: ROUTE_PREFIXES.movies,
        movieController,
        authMiddleware
      });
      await api.register(uploadRoutes, {
        prefix: ROUTE_PREFIXES.uploads,
        uploadController,
        authMiddleware
      });
      await api.register(userRoutes, {
        prefix: ROUTE_PREFIXES.users,
        userController,
        authMiddleware
      });
    },
    { prefix: "/api/v1" }
  );

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
