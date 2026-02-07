import { ListMovies } from "@/application/use-cases/movie";
import { PrismaMovieRepository } from "@/infra/database/repositories";

export function makeListMovies(): ListMovies {
  return new ListMovies(
    new PrismaMovieRepository()
  );
}
