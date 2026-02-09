import { makePrismaClient } from "@/main/prisma";
import { PrismaUserRepository } from "@/infra/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makeUserRepository = singleton(() => new PrismaUserRepository(makePrismaClient()));
