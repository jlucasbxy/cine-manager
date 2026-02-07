import { buildApp } from "@/main/app";

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: app.config.PORT, host: app.config.HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
