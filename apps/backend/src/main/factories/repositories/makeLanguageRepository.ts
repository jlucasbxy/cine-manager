import { makePrismaClient } from "@/main/prisma";
import { PrismaLanguageRepository } from "@/infra/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeLanguageRepository = singleton(() => new PrismaLanguageRepository(makePrismaClient()));
