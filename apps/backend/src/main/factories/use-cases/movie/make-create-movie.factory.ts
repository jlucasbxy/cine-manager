import { CreateMovie } from "@/application/use-cases/movie";
import { makeTransactionManager } from "@/main/factories/providers";

export function makeCreateMovie(): CreateMovie {
  return new CreateMovie(makeTransactionManager());
}
