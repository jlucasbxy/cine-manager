import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";
import { GenericContainer, type StartedTestContainer } from "testcontainers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../..");
const prismaSchemaPath = "src/infrastructure/database/prisma/schema.prisma";

const ensureBaseEnv = (): void => {
  process.env.NODE_ENV = "test";
  process.env.ACCESS_TOKEN_SECRET ??=
    "test-access-token-secret-minimum-32-chars";
  process.env.ACCESS_TOKEN_EXPIRES_IN ??= "15m";
  process.env.REFRESH_TOKEN_EXPIRES_IN ??= "7d";
  process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN ??= "1h";
  process.env.RESEND_API_KEY ??= "re_test_key";
  process.env.EMAIL_FROM ??= "noreply@example.com";
  process.env.FRONTEND_URL ??= "http://localhost:5173";
  process.env.ENABLE_DOCS ??= "false";
  process.env.S3_BUCKET ??= "movies-uploads";
  process.env.S3_REGION ??= "us-east-1";
  process.env.S3_ENDPOINT ??= "http://localhost:9000";
  process.env.S3_ACCESS_KEY_ID ??= "minioadmin";
  process.env.S3_SECRET_ACCESS_KEY ??= "minioadmin";
  process.env.S3_FORCE_PATH_STYLE ??= "true";
  process.env.UPLOAD_URL_EXPIRES_IN ??= "900";
};

const setupSchema = (databaseUrl: string): void => {
  execFileSync("npx", ["prisma", "db", "push", "--schema", prismaSchemaPath], {
    cwd: backendRoot,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl
    },
    stdio: "inherit"
  });
};

export default async function globalSetup() {
  ensureBaseEnv();

  let postgres: StartedTestContainer;
  let redis: StartedTestContainer;
  let minio: StartedTestContainer;

  try {
    postgres = await new GenericContainer("postgres:18-alpine")
      .withEnvironment({
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "postgres",
        POSTGRES_DB: "cine_manager_test"
      })
      .withExposedPorts(5432)
      .start();

    redis = await new GenericContainer("redis:7-alpine")
      .withExposedPorts(6379)
      .start();

    minio = await new GenericContainer("minio/minio:latest")
      .withEnvironment({
        MINIO_ROOT_USER: "minioadmin",
        MINIO_ROOT_PASSWORD: "minioadmin"
      })
      .withCommand(["server", "/data", "--console-address", ":9001"])
      .withExposedPorts(9000)
      .start();
  } catch (error) {
    throw new Error(
      "Integration tests require a working Docker/OCI runtime (Postgres, Redis, MinIO). Start Docker (or Podman) and rerun `npm run test:integration --workspace=backend`.",
      { cause: error as Error }
    );
  }

  const databaseUrl = `postgresql://postgres:postgres@${postgres.getHost()}:${postgres.getMappedPort(5432)}/cine_manager_test?schema=public`;
  const redisUrl = `redis://${redis.getHost()}:${redis.getMappedPort(6379)}`;

  process.env.DATABASE_URL = databaseUrl;
  process.env.INTEGRATION_DATABASE_URL = databaseUrl;
  process.env.REDIS_URL = redisUrl;
  process.env.INTEGRATION_REDIS_URL = redisUrl;
  process.env.S3_ENDPOINT = `http://${minio.getHost()}:${minio.getMappedPort(9000)}`;
  process.env.S3_FORCE_PATH_STYLE = "true";
  process.env.S3_ACCESS_KEY_ID = "minioadmin";
  process.env.S3_SECRET_ACCESS_KEY = "minioadmin";

  setupSchema(databaseUrl);
  await ensureBucket();

  return async () => {
    await stopContainer(minio);
    await stopContainer(redis);
    await stopContainer(postgres);
  };
}

async function ensureBucket(): Promise<void> {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const bucket = process.env.S3_BUCKET;

  if (!endpoint || !region || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("S3 environment variables are required for integration tests");
  }

  const client = new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey }
  });

  try {
    await client.send(new CreateBucketCommand({ Bucket: bucket }));
  } finally {
    await client.destroy();
  }
}

async function stopContainer(container: StartedTestContainer): Promise<void> {
  await container.stop();
}
