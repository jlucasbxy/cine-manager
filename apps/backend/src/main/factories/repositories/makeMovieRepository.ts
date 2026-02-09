import { prisma } from "@/infra/database/prisma";
import { PrismaMovieRepository } from "@/infra/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeMovieRepository = singleton(() => new PrismaMovieRepository(prisma));
