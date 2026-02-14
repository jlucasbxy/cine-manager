import { UpdateUser } from "@/application/use-cases/user";
import {
  makeHashProvider,
  makeTransactionManager
} from "@/main/factories/providers";

export function makeUpdateUser(): UpdateUser {
  return new UpdateUser(makeHashProvider(), makeTransactionManager());
}
