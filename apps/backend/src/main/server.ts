import path from "node:path";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { ErrorCode } from "@repo/dtos";
import Fastify from "fastify";
import type { LogProvider } from "@/application/interfaces/providers";
import { env } from "@/infrastructure/config/env.config";
import { ROUTE_PREFIXES } from "@/infrastructure/config/routes.config";
import { errorHandler } from "@/infrastructure/http/middlewares";
import {
  authRoutes,
  genreRoutes,
  healthRoutes,
  languageRoutes,
  movieListRoutes,
  movieRoutes,
  uploadRoutes,
  userRoutes
} from "@/infrastructure/http/routes";
import { PinoLogProvider } from "@/infrastructure/providers";
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
import { startPgBoss, stopPgBoss } from "@/main/factories/queue";
import { makeRedisClient } from "@/main/factories/redis";
import { registerWorkers } from "@/main/worker";

declare module "fastify" {
  interface FastifyRequest {
    logProvider: LogProvider;
  }
}

export async function createApp() {
  const app = Fastify({
    logger: env.IS_TEST
      ? false
      : env.IS_DEVELOPMENT
        ? {
            transport: {
              target: "pino-pretty",
              options: { translateTime: "HH:MM:ss", ignore: "pid,hostname" }
            }
          }
        : true
  });

  const boss = await startPgBoss();
  boss.on("error", (error) => {
    app.log.error({ err: error }, "pg-boss error");
  });
  await registerWorkers(boss);
  app.addHook("onClose", async () => {
    await stopPgBoss();
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

  await app.register(helmet);
  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true
  });
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

  app.addHook("onRequest", (request, _reply, done) => {
    request.logProvider = PinoLogProvider.fromLogger(request.log);
    done();
  });

  await app.register(healthRoutes, { prefix: "/health" });

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
      api.addHook("preHandler", (request, _reply, done) => {
        if (request.userId) {
          request.logProvider = request.logProvider.child({
            userId: request.userId
          });
        }
        done();
      });

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

  await app.ready();
  return app;
}

export async function start() {
  const app = await createApp();

  const shutdown = async () => {
    await app.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
