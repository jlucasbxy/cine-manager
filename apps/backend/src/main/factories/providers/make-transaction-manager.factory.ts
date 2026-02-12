import { PrismaTransactionManager } from "@/infrastructure/providers";
import { makePrismaClient } from "@/main/factories/prisma";
import { singleton } from "@/main/factories/singleton.util";

export const makeTransactionManager = singleton(
  () => new PrismaTransactionManager(makePrismaClient())
);
