import { afterAll, beforeAll, beforeEach } from "vitest";
import {
  closeIntegrationClients,
  getIntegrationPrismaClient,
  getIntegrationRedisClient,
  resetDatabase,
  resetRedis
} from "./helpers/integration-context";

beforeAll(async () => {
  await getIntegrationPrismaClient().$connect();
  await getIntegrationRedisClient().ping();
});

beforeEach(async () => {
  await resetDatabase();
  await resetRedis();
});

afterAll(async () => {
  await closeIntegrationClients();
});
