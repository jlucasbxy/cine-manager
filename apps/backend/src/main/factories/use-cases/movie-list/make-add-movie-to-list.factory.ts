import { AddMovieToList } from "@/application/use-cases/movie-list";
import { makeTransactionManager } from "@/main/factories/providers";

export function makeAddMovieToList(): AddMovieToList {
  return new AddMovieToList(makeTransactionManager());
}
