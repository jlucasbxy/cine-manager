import { ResetPassword } from "@/application/use-cases/auth";
import {
  makeUserRepository,
  makePasswordResetTokenRepository,
  makeRefreshTokenRepository
} from "@/main/factories/repositories";
import { makeHashProvider } from "@/main/factories/providers";

export function makeResetPassword(): ResetPassword {
  return new ResetPassword(
    makeUserRepository(),
    makePasswordResetTokenRepository(),
    makeRefreshTokenRepository(),
    makeHashProvider()
  );
}
