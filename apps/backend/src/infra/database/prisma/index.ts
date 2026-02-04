import { PrismaPg } from "@prisma/adapter-pg";
// eslint-disable-next-line no-restricted-imports
import { PrismaClient } from "./generated/prisma/client";
import { env } from "@/infra/config/env";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL })
});
