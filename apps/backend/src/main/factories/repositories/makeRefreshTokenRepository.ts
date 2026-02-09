import { prisma } from "@/infra/database/prisma";
import { PrismaRefreshTokenRepository } from "@/infra/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeRefreshTokenRepository = singleton(() => new PrismaRefreshTokenRepository(prisma));
