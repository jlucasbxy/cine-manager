import { makePrismaClient } from "@/main/prisma";
import { PrismaGenreRepository } from "@/infrastructure/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeGenreRepository = singleton(() => new PrismaGenreRepository(makePrismaClient()));
