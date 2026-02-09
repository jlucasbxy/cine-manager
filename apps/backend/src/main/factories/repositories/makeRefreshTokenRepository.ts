import { makePrismaClient } from "@/main/prisma";
import { PrismaRefreshTokenRepository } from "@/infra/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeRefreshTokenRepository = singleton(() => new PrismaRefreshTokenRepository(makePrismaClient()));
