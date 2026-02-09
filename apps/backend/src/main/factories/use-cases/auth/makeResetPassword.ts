import { ResetPassword } from "@/application/use-cases/auth";
import {
  makeUserRepository,
  makePasswordResetTokenRepository,
  makeRefreshTokenRepository
} from "@/main/factories/repositories";
import { BcryptHashProvider } from "@/infrastructure/providers";

export function makeResetPassword(): ResetPassword {
  return new ResetPassword(
    makeUserRepository(),
    makePasswordResetTokenRepository(),
    makeRefreshTokenRepository(),
    new BcryptHashProvider()
  );
}
