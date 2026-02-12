import { makePrismaClient } from "@/main/factories/prisma";
import { PrismaUserRepository } from "@/infrastructure/database/repositories";
import { singleton } from "@/main/factories/singleton.util";

export const makeUserRepository = singleton(
  () => new PrismaUserRepository(makePrismaClient())
);
