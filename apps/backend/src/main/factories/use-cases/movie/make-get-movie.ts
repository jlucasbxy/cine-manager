import { GetMovie } from "@/application/use-cases/movie";
import { makeMovieRepository } from "@/main/factories/repositories";

export function makeGetMovie(): GetMovie {
  return new GetMovie(makeMovieRepository());
}
