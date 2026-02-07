import { MovieServiceImpl } from "@/infra/services";
import {
  makeCreateMovie,
  makeUpdateMovie,
  makeDeleteMovie,
  makeGetMovie,
  makeListMovies
} from "@/main/factories/use-cases/movie";

export function makeMovieService(): MovieServiceImpl {
  return new MovieServiceImpl(
    makeCreateMovie(),
    makeUpdateMovie(),
    makeDeleteMovie(),
    makeGetMovie(),
    makeListMovies()
  );
}
