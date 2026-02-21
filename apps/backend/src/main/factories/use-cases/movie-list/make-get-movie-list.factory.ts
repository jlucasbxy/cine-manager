import { GetMovieList } from "@/application/use-cases/movie-list";
import { makeMovieListRepository } from "@/main/factories/repositories";

export function makeGetMovieList(): GetMovieList {
  return new GetMovieList(makeMovieListRepository());
}
