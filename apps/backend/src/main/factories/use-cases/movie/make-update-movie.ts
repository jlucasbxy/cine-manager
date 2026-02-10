import { UpdateMovie } from "@/application/use-cases/movie";
import { makeMovieRepository } from "@/main/factories/repositories";

export function makeUpdateMovie(): UpdateMovie {
  return new UpdateMovie(makeMovieRepository());
}
