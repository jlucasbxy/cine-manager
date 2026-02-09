import { makePrismaClient } from "@/main/factories/prisma";
import { PrismaRefreshTokenRepository } from "@/infrastructure/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeRefreshTokenRepository = singleton(() => new PrismaRefreshTokenRepository(makePrismaClient()));
