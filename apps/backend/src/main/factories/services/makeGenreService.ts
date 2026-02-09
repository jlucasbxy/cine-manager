import { GenreServiceImpl } from "@/infra/services";
import { makeListGenres } from "@/main/factories/use-cases/genre";

export function makeGenreService(): GenreServiceImpl {
  return new GenreServiceImpl(
    makeListGenres()
  );
}
