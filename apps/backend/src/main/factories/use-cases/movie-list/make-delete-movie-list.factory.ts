import { DeleteMovieList } from "@/application/use-cases/movie-list";
import { makeMovieListRepository } from "@/main/factories/repositories";

export function makeDeleteMovieList(): DeleteMovieList {
  return new DeleteMovieList(makeMovieListRepository());
}
