import { makePrismaClient } from "@/main/prisma";
import { PrismaMovieRepository } from "@/infrastructure/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeMovieRepository = singleton(() => new PrismaMovieRepository(makePrismaClient()));
