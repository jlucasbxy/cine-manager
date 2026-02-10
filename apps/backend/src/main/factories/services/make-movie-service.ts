import { MovieServiceImpl } from "@/infrastructure/services";
import {
  makeCreateMovie,
  makeUpdateMovie,
  makeDeleteMovie,
  makeGetMovie,
  makeListMovies
} from "@/main/factories/use-cases/movie";
import { singleton } from "@/main/factories/singleton";

export const makeMovieService = singleton(
  () =>
    new MovieServiceImpl(
      makeCreateMovie(),
      makeUpdateMovie(),
      makeDeleteMovie(),
      makeGetMovie(),
      makeListMovies()
    )
);
