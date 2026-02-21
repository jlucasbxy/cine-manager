import { RemoveMovieFromList } from "@/application/use-cases/movie-list";
import { makeMovieListRepository } from "@/main/factories/repositories";

export function makeRemoveMovieFromList(): RemoveMovieFromList {
  return new RemoveMovieFromList(makeMovieListRepository());
}
