import { ResetPassword } from "@/application/use-cases/auth";
import {
  makePasswordResetTokenRepository
} from "@/main/factories/repositories";
import {
  makeHashProvider,
  makeTransactionManager
} from "@/main/factories/providers";

export function makeResetPassword(): ResetPassword {
  return new ResetPassword(
    makePasswordResetTokenRepository(),
    makeHashProvider(),
    makeTransactionManager()
  );
}
