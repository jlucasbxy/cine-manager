import type { FastifyInstance } from "fastify";

let app: FastifyInstance | null = null;

export const createTestApp = async (): Promise<FastifyInstance> => {
  const { createApp } = await import("@/main/server");
  app = await createApp();
  return app;
};

export const getApp = (): FastifyInstance => {
  if (!app) {
    throw new Error("Test app not created. Call createTestApp() first.");
  }
  return app;
};

export const closeApp = async (): Promise<void> => {
  if (app) {
    await app.close();
    app = null;
  }
};
