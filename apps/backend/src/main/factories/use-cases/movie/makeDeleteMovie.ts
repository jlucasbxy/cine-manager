import { DeleteMovie } from "@/application/use-cases/movie";
import { PrismaMovieRepository } from "@/infra/database/repositories";

export function makeDeleteMovie(): DeleteMovie {
  return new DeleteMovie(
    new PrismaMovieRepository()
  );
}
