import { ListMovies } from "@/application/use-cases/movie";
import { makeMovieRepository } from "@/main/factories/repositories";

export function makeListMovies(): ListMovies {
  return new ListMovies(makeMovieRepository());
}
