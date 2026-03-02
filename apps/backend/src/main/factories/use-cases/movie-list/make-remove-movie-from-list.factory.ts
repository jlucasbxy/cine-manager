import { RemoveMovieFromList } from "@/application/use-cases/movie-list";
import { makeTransactionManager } from "@/main/factories/providers";

export function makeRemoveMovieFromList(): RemoveMovieFromList {
  return new RemoveMovieFromList(makeTransactionManager());
}
