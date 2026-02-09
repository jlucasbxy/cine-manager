import { ListGenres } from "@/application/use-cases/genre";
import { makeGenreRepository } from "@/main/factories/repositories";

export function makeListGenres(): ListGenres {
  return new ListGenres(
    makeGenreRepository()
  );
}
