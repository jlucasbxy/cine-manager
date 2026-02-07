import { UpdateMovie } from "@/application/use-cases/movie";
import { PrismaMovieRepository } from "@/infra/database/repositories";

export function makeUpdateMovie(): UpdateMovie {
  return new UpdateMovie(
    new PrismaMovieRepository()
  );
}
