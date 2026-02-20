import { MovieServiceImpl } from "@/infrastructure/services";
import { singleton } from "@/main/factories/singleton.util";
import {
  makeCreateMovie,
  makeDeleteMovie,
  makeGetMovie,
  makeListMovies,
  makeRateMovie,
  makeUpdateMovie
} from "@/main/factories/use-cases/movie";

export const makeMovieService = singleton(
  () =>
    new MovieServiceImpl(
      makeCreateMovie(),
      makeUpdateMovie(),
      makeDeleteMovie(),
      makeGetMovie(),
      makeListMovies(),
      makeRateMovie()
    )
);
