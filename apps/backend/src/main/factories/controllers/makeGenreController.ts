import { GenreController } from "@/infrastructure/http/controllers";
import { makeGenreService } from "@/main/factories/services";

export function makeGenreController(): GenreController {
  return new GenreController(makeGenreService());
}
