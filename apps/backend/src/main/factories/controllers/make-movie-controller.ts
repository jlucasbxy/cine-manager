import { MovieController } from "@/infrastructure/http/controllers";
import {
  CreateMovieValidator,
  UpdateMovieValidator,
  IdValidator,
  QueryMoviesValidator
} from "@repo/validators";
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
