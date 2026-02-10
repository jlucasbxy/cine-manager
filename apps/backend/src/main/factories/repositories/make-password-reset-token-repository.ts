import { makePrismaClient } from "@/main/factories/prisma";
import { PrismaPasswordResetTokenRepository } from "@/infrastructure/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makePasswordResetTokenRepository = singleton(
  () => new PrismaPasswordResetTokenRepository(makePrismaClient())
);
