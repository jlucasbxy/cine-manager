import { makePrismaClient } from "@/main/factories/prisma";
import { PrismaLanguageRepository } from "@/infrastructure/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeLanguageRepository = singleton(
  () => new PrismaLanguageRepository(makePrismaClient())
);
