// eslint-disable-next-line no-restricted-imports
import { PrismaClient } from "./generated/prisma/client";
import type { TransactionClient } from "./generated/prisma/internal/prismaNamespace";
export type PrismaDatabase = PrismaClient | TransactionClient;
