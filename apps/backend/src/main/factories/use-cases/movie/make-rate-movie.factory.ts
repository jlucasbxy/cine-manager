import { RateMovie } from "@/application/use-cases/movie";
import { makeTransactionManager } from "@/main/factories/providers";

export function makeRateMovie(): RateMovie {
  return new RateMovie(makeTransactionManager());
}
