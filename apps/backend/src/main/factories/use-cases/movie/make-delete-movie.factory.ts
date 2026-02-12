import { DeleteMovie } from "@/application/use-cases/movie";
import { makeMovieRepository } from "@/main/factories/repositories";

export function makeDeleteMovie(): DeleteMovie {
  return new DeleteMovie(makeMovieRepository());
}
