import { PrismaPg } from "@prisma/adapter-pg";
import Redis from "ioredis";
import { PrismaClient } from "@/infrastructure/database/prisma/generated/prisma/client";

let prismaClient: PrismaClient | null = null;
let redisClient: Redis | null = null;

const REQUIRED_TABLES = [
  "Rating",
  "MovieList",
  "Movie",
  "OutboxEvent",
  "PasswordResetToken",
  "RefreshToken",
  "Genre",
  "Language",
  "User"
];

const requiredEnv = (
  name: "INTEGRATION_DATABASE_URL" | "INTEGRATION_REDIS_URL"
): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for integration tests`);
  }
  return value;
};

export const getIntegrationPrismaClient = (): PrismaClient => {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: requiredEnv("INTEGRATION_DATABASE_URL")
      })
    });
  }
  return prismaClient;
};

export const getIntegrationRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(requiredEnv("INTEGRATION_REDIS_URL"));
  }
  return redisClient;
};

export const resetDatabase = async (): Promise<void> => {
  const prisma = getIntegrationPrismaClient();
  const tableList = REQUIRED_TABLES.map((table) => `"${table}"`).join(", ");
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE;`
  );
};

export const resetRedis = async (): Promise<void> => {
  await getIntegrationRedisClient().flushdb();
};

export const closeIntegrationClients = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
};
