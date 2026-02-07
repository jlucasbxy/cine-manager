import { ResetPassword } from "@/application/use-cases/auth";
import {
  PrismaUserRepository,
  PrismaPasswordResetTokenRepository,
  PrismaRefreshTokenRepository
} from "@/infra/database/repositories";
import { BcryptHashProvider } from "@/infra/providers";

export function makeResetPassword(): ResetPassword {
  return new ResetPassword(
    new PrismaUserRepository(),
    new PrismaPasswordResetTokenRepository(),
    new PrismaRefreshTokenRepository(),
    new BcryptHashProvider()
  );
}
