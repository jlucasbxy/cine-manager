import { GenreServiceImpl } from "@/infrastructure/services";
import { singleton } from "@/main/factories/singleton.util";
import { makeListGenres } from "@/main/factories/use-cases/genre";

export const makeGenreService = singleton(
  () => new GenreServiceImpl(makeListGenres())
);
