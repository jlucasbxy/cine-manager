import { makePrismaClient } from "@/main/factories/prisma";
import { PrismaGenreRepository } from "@/infrastructure/database/repositories";
import { singleton } from "@/main/factories/singleton.util";

export const makeGenreRepository = singleton(
  () => new PrismaGenreRepository(makePrismaClient())
);
