import { MovieListMapper } from "@/application/mappers/movie-list.mapper";
import { Movie } from "@/domain/entities/movie.entity";
import { MovieList } from "@/domain/entities/movie-list.entity";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import {
  AgeRating,
  Money,
  MovieStatus,
  NonNegativeDecimal,
  NonNegativeInt,
  Url,
  Uuid
} from "@/domain/value-objects";

function makeMovieList() {
  const now = new Date("2024-06-01T12:00:00Z");
  return MovieList.reconstitute({
    id: Uuid.reconstitute("list-id"),
    name: "Favorites",
    userId: Uuid.reconstitute("user-id"),
    createdAt: now,
    updatedAt: now
  });
}

function makeMovie() {
  const now = new Date("2024-06-01T12:00:00Z");
  return Movie.reconstitute({
    id: Uuid.reconstitute("movie-id"),
    title: "Test Movie",
    originalTitle: "Original",
    tagline: "Tagline",
    synopsis: "Synopsis",
    releaseDate: now,
    runtime: NonNegativeInt.reconstitute(120),
    status: MovieStatus.reconstitute(MovieStatusEnum.RELEASED),
    ageRating: AgeRating.reconstitute(AgeRatingEnum.L),
    languageId: Uuid.reconstitute("lang-id"),
    budget: Money.reconstitute(0),
    revenue: Money.reconstitute(0),
    posterUrl: Url.reconstitute("https://example.com/poster.jpg"),
    backdropUrl: Url.reconstitute("https://example.com/backdrop.jpg"),
    trailerUrl: Url.reconstitute("https://example.com/trailer.mp4"),
    votes: NonNegativeInt.reconstitute(0),
    score: NonNegativeDecimal.reconstitute(0),
    isPublic: true,
    createdAt: now,
    updatedAt: now,
    userId: Uuid.reconstitute("user-id")
  });
}

describe("MovieListMapper", () => {
  describe("toDTO", () => {
    it("maps movie list entity to DTO", () => {
      const list = makeMovieList();
      const dto = MovieListMapper.toDTO(list);

      expect(dto).toEqual({
        id: "list-id",
        name: "Favorites",
        userId: "user-id",
        createdAt: "2024-06-01T12:00:00.000Z",
        updatedAt: "2024-06-01T12:00:00.000Z"
      });
    });
  });

  describe("toDTOWithMovies", () => {
    it("maps movie list with movies", () => {
      const list = makeMovieList();
      const movie = makeMovie();
      const listWithMovies = { ...list, movies: [movie] };
      const dto = MovieListMapper.toDTOWithMovies(listWithMovies);

      expect(dto.id).toBe("list-id");
      expect(dto.movies).toHaveLength(1);
      expect(dto.movies![0].id).toBe("movie-id");
    });

    it("maps empty movies array", () => {
      const list = makeMovieList();
      const listWithMovies = { ...list, movies: [] };
      const dto = MovieListMapper.toDTOWithMovies(listWithMovies);

      expect(dto.movies).toEqual([]);
    });
  });
});
