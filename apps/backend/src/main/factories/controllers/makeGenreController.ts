import { GenreController } from "@/infra/http/controllers";
import { makeGenreService } from "@/main/factories/services";

export function makeGenreController(): GenreController {
  return new GenreController(
    makeGenreService()
  );
}
