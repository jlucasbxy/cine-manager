import { CreateMovie } from "@/application/use-cases/movie";
import { PrismaMovieRepository } from "@/infra/database/repositories";

export function makeCreateMovie(): CreateMovie {
  return new CreateMovie(
    new PrismaMovieRepository()
  );
}
