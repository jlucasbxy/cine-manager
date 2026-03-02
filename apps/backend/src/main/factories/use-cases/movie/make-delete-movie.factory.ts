import { DeleteMovie } from "@/application/use-cases/movie";
import { makeTransactionManager } from "@/main/factories/providers";

export function makeDeleteMovie(): DeleteMovie {
  return new DeleteMovie(makeTransactionManager());
}
