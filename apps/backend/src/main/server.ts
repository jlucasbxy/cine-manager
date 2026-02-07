import { env } from "@/infra/config/env";
import { buildApp } from "@/main/app";

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
