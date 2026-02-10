import { PrismaNotificationOutboxRepository } from "@/infrastructure/database/repositories";
import { makePrismaClient } from "@/main/factories/prisma";
import { singleton } from "@/main/factories/singleton";

export const makeNotificationOutboxRepository = singleton(
  () => new PrismaNotificationOutboxRepository(makePrismaClient())
);
