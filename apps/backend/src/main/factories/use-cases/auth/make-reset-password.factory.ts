import { ResetPassword } from "@/application/use-cases/auth";
import {
  makeHashProvider,
  makeTransactionManager
} from "@/main/factories/providers";

export function makeResetPassword(): ResetPassword {
  return new ResetPassword(makeHashProvider(), makeTransactionManager());
}
