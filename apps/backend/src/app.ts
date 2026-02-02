import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import { healthRoutes } from "./routes/health";

const envSchema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "number",
      default: 3000
    },
    HOST: {
      type: "string",
      default: "0.0.0.0"
    }
  }
} as const;

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      HOST: string;
    };
  }
}

export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  await app.register(fastifyEnv, { schema: envSchema, dotenv: true });
  await app.register(cors);
  await app.register(healthRoutes);

  return app;
}
