import { makePrismaClient } from "@/main/prisma";
import { PrismaLanguageRepository } from "@/infrastructure/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeLanguageRepository = singleton(() => new PrismaLanguageRepository(makePrismaClient()));
