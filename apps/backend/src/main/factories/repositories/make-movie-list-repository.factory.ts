import { PrismaMovieListRepository } from "@/infrastructure/database/repositories";
import { makePrismaClient } from "@/main/factories/prisma";
import { singleton } from "@/main/factories/singleton.util";

export const makeMovieListRepository = singleton(
  () => new PrismaMovieListRepository(makePrismaClient())
);
