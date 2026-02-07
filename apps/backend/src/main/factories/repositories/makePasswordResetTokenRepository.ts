import { PrismaPasswordResetTokenRepository } from "@/infra/database/repositories";
import { singleton } from "@/main/factories/singleton";

export const makePasswordResetTokenRepository = singleton(() => new PrismaPasswordResetTokenRepository());
