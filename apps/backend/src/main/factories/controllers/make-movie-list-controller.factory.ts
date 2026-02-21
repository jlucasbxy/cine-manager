import {
  AddMovieToListValidator,
  CreateMovieListValidator,
  IdValidator,
  UpdateMovieListValidator
} from "@repo/validators";
import { MovieListController } from "@/infrastructure/http/controllers";
import { makeMovieListService } from "@/main/factories/services";

export function makeMovieListController(): MovieListController {
  return new MovieListController(
    makeMovieListService(),
    new CreateMovieListValidator(),
    new UpdateMovieListValidator(),
    new AddMovieToListValidator(),
    new IdValidator()
  );
}
