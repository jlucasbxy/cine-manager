import { makePrismaClient } from "@/main/factories/prisma";
import { PrismaMovieRepository } from "@/infrastructure/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeMovieRepository = singleton(() => new PrismaMovieRepository(makePrismaClient()));
