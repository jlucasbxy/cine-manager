import { CreateMovie } from "@/application/use-cases/movie";
import { makeMovieRepository } from "@/main/factories/repositories";

export function makeCreateMovie(): CreateMovie {
  return new CreateMovie(
    makeMovieRepository()
  );
}
