import { makePrismaClient } from "@/main/factories/prisma";
import { PrismaGenreRepository } from "@/infrastructure/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeGenreRepository = singleton(
  () => new PrismaGenreRepository(makePrismaClient())
);
