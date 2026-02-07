import { GetMovie } from "@/application/use-cases/movie";
import { PrismaMovieRepository } from "@/infra/database/repositories";

export function makeGetMovie(): GetMovie {
  return new GetMovie(
    new PrismaMovieRepository()
  );
}
