import { prisma } from "@/infra/database/prisma";
import { PrismaGenreRepository } from "@/infra/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeGenreRepository = singleton(() => new PrismaGenreRepository(prisma));
