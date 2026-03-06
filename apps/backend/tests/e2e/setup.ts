import { afterAll, beforeAll, beforeEach } from "vitest";
import { createTestApp, closeApp } from "./helpers/app-context";
import {
  closeE2eClients,
  getE2ePrismaClient,
  getE2eRedisClient,
  resetDatabase,
  resetRedis
} from "./helpers/e2e-context";

beforeAll(async () => {
  await getE2ePrismaClient().$connect();
  await getE2eRedisClient().ping();
  await createTestApp();
});

beforeEach(async () => {
  await resetDatabase();
  await resetRedis();
});

afterAll(async () => {
  await closeApp();
  await closeE2eClients();
});
