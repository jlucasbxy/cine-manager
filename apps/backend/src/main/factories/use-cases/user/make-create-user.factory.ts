import { CreateUser } from "@/application/use-cases/user";
import { makeHashProvider, makeTransactionManager } from "@/main/factories/providers";

export function makeCreateUser(): CreateUser {
  return new CreateUser(makeHashProvider(), makeTransactionManager());
}
