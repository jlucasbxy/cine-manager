import { PrismaPg } from "@prisma/adapter-pg";
// eslint-disable-next-line no-restricted-imports
import { PrismaClient } from "@/infra/database/prisma/generated/prisma/client";
import { env } from "@/infra/config/env";
import { singleton } from "@/main/factories/singleton";

export const makePrismaClient = singleton(() =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL })
  })
);
