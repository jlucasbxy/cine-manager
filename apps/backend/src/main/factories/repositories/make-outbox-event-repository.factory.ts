import { PrismaOutboxEventRepository } from "@/infrastructure/database/repositories";
import { makePrismaClient } from "@/main/factories/prisma";
import { singleton } from "@/main/factories/singleton.util";

export const makeOutboxEventRepository = singleton(
  () => new PrismaOutboxEventRepository(makePrismaClient())
);
