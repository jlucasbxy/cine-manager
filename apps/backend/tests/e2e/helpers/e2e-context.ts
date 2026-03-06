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

const requiredEnv = (name: "E2E_DATABASE_URL" | "E2E_REDIS_URL"): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for e2e tests`);
  }
  return value;
};

export const getE2ePrismaClient = (): PrismaClient => {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: requiredEnv("E2E_DATABASE_URL")
      })
    });
  }
  return prismaClient;
};

export const getE2eRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(requiredEnv("E2E_REDIS_URL"));
  }
  return redisClient;
};

export const resetDatabase = async (): Promise<void> => {
  const prisma = getE2ePrismaClient();
  const tableList = REQUIRED_TABLES.map((table) => `"${table}"`).join(", ");
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE;`
  );
};

export const resetRedis = async (): Promise<void> => {
  await getE2eRedisClient().flushdb();
};

export const closeE2eClients = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
};
