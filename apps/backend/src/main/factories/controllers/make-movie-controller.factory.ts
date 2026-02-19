import {
  CreateMovieValidator,
  IdValidator,
  QueryMoviesValidator,
  UpdateMovieValidator
} from "@repo/validators";
import { MovieController } from "@/infrastructure/http/controllers";
import { makeMovieService } from "@/main/factories/services";

export function makeMovieController(): MovieController {
  return new MovieController(
    makeMovieService(),
    new CreateMovieValidator(),
    new UpdateMovieValidator(),
    new IdValidator(),
    new QueryMoviesValidator()
  );
}
