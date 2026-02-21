import { MovieList } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects";
import type { MovieListModel } from "@/infrastructure/database/prisma/generated/prisma/models/MovieList";

export class PrismaMovieListMapper {
  static toDomain(raw: MovieListModel): MovieList {
    return MovieList.reconstitute({
      id: Uuid.reconstitute(raw.id),
      name: raw.name,
      userId: Uuid.reconstitute(raw.userId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    });
  }
}
