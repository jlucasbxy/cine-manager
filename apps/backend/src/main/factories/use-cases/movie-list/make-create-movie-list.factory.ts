import { CreateMovieList } from "@/application/use-cases/movie-list";
import { makeMovieListRepository } from "@/main/factories/repositories";

export function makeCreateMovieList(): CreateMovieList {
  return new CreateMovieList(makeMovieListRepository());
}
