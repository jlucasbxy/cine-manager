import { S3Client } from "@aws-sdk/client-s3";
import { PrismaPg } from "@prisma/adapter-pg";
import Redis from "ioredis";
import { PrismaClient } from "@/infrastructure/database/prisma/generated/prisma/client";

let prismaClient: PrismaClient | null = null;
let redisClient: Redis | null = null;
let s3Client: S3Client | null = null;

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

const INTEGRATION_S3_CONFIG = {
  bucket: "movies-uploads",
  region: "us-east-1",
  accessKeyId: "minioadmin",
  secretAccessKey: "minioadmin",
  forcePathStyle: true
} as const;

const requiredEnv = (
  name: "INTEGRATION_DATABASE_URL" | "INTEGRATION_REDIS_URL"
): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for integration tests`);
  }
  return value;
};

const requiredLocalS3Endpoint = (): string => {
  const endpoint = process.env.S3_ENDPOINT;
  if (!endpoint) {
    throw new Error("S3_ENDPOINT is required for integration tests");
  }

  const url = new URL(endpoint);
  if (
    url.protocol !== "http:" ||
    (url.hostname !== "localhost" && url.hostname !== "127.0.0.1")
  ) {
    throw new Error(`Unsafe S3 endpoint for tests: ${endpoint}`);
  }

  return endpoint;
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

export const getIntegrationS3Config = () => ({
  ...INTEGRATION_S3_CONFIG,
  endpoint: requiredLocalS3Endpoint()
});

export const getIntegrationS3Client = (): S3Client => {
  if (!s3Client) {
    const s3Config = getIntegrationS3Config();
    s3Client = new S3Client({
      endpoint: s3Config.endpoint,
      region: s3Config.region,
      forcePathStyle: s3Config.forcePathStyle,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey
      }
    });
  }
  return s3Client;
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
  if (s3Client) {
    s3Client.destroy();
    s3Client = null;
  }
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
};
