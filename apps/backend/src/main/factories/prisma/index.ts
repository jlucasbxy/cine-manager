import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/infrastructure/database/prisma/generated/prisma/client";
import { env } from "@/infrastructure/config/env.config";
import { singleton } from "@/main/factories/singleton.util";

export const makePrismaClient = singleton(() => {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL })
  });
});
