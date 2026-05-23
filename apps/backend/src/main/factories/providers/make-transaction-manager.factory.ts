import { PrismaTransactionManager } from "@/infrastructure/providers";
import { makePrismaClient } from "@/main/factories/prisma";
import { makePgBoss } from "@/main/factories/queue";
import { singleton } from "@/main/factories/singleton.util";

export const makeTransactionManager = singleton(
  () => new PrismaTransactionManager(makePrismaClient(), makePgBoss())
);
