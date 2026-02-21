import { ListMovieLists } from "@/application/use-cases/movie-list";
import { makeMovieListRepository } from "@/main/factories/repositories";

export function makeListMovieLists(): ListMovieLists {
  return new ListMovieLists(makeMovieListRepository());
}
