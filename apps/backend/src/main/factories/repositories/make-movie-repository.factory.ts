import { CachedMovieRepository } from "@/infrastructure/cache";
import { PrismaMovieRepository } from "@/infrastructure/database/repositories";
import { makePrismaClient } from "@/main/factories/prisma";
import { makeCacheProvider } from "@/main/factories/providers";
import { singleton } from "@/main/factories/singleton.util";

export const makeMovieRepository = singleton(
  () =>
    new CachedMovieRepository(
      new PrismaMovieRepository(makePrismaClient()),
      makeCacheProvider()
    )
);
