import { MovieListServiceImpl } from "@/infrastructure/services";
import { singleton } from "@/main/factories/singleton.util";
import {
  makeAddMovieToList,
  makeCreateMovieList,
  makeDeleteMovieList,
  makeGetMovieList,
  makeListMovieLists,
  makeRemoveMovieFromList,
  makeUpdateMovieList
} from "@/main/factories/use-cases/movie-list";

export const makeMovieListService = singleton(
  () =>
    new MovieListServiceImpl(
      makeCreateMovieList(),
      makeListMovieLists(),
      makeGetMovieList(),
      makeUpdateMovieList(),
      makeDeleteMovieList(),
      makeAddMovieToList(),
      makeRemoveMovieFromList()
    )
);
