import { GenreServiceImpl } from "@/infrastructure/services";
import { makeListGenres } from "@/main/factories/use-cases/genre";
import { singleton } from "@/main/factories/singleton";

export const makeGenreService = singleton(
  () => new GenreServiceImpl(makeListGenres())
);
