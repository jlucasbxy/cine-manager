import { AddMovieToList } from "@/application/use-cases/movie-list";
import { makeMovieListRepository } from "@/main/factories/repositories";

export function makeAddMovieToList(): AddMovieToList {
  return new AddMovieToList(makeMovieListRepository());
}
