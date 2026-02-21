import { UpdateMovieList } from "@/application/use-cases/movie-list";
import { makeMovieListRepository } from "@/main/factories/repositories";

export function makeUpdateMovieList(): UpdateMovieList {
  return new UpdateMovieList(makeMovieListRepository());
}
