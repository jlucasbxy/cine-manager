import { MovieList } from "@/domain/entities/movie-list.entity";
import { Uuid } from "@/domain/value-objects";

type MovieListOverrides = Partial<{
  id: Uuid;
  name: string;
  userId: Uuid;
  createdAt: Date;
  updatedAt: Date;
}>;

export function makeMovieList(overrides: MovieListOverrides = {}): MovieList {
  return MovieList.reconstitute({
    id: overrides.id ?? Uuid.generate(),
    name: overrides.name ?? "Favorites",
    userId: overrides.userId ?? Uuid.generate(),
    createdAt: overrides.createdAt ?? new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: overrides.updatedAt ?? new Date("2024-01-01T00:00:00.000Z")
  });
}
