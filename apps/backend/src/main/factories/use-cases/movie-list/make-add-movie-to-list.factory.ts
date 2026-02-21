import { AddMovieToList } from "@/application/use-cases/movie-list";
import { makeMovieListRepository, makeMovieRepository } from "@/main/factories/repositories";

export function makeAddMovieToList(): AddMovieToList {
  return new AddMovieToList(makeMovieListRepository(), makeMovieRepository());
}
