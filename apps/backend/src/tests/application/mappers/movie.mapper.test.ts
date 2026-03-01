import { MovieMapper } from "@/application/mappers/movie.mapper";
import { Movie } from "@/domain/entities/movie.entity";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import {
  AgeRating,
  MovieStatus,
  NonNegativeInt,
  NonNegativeNumber,
  Url,
  Uuid
} from "@/domain/value-objects";

function makeMovie() {
  const now = new Date("2024-06-01T12:00:00Z");
  return Movie.reconstitute({
    id: Uuid.reconstitute("movie-id"),
    title: "Test Movie",
    originalTitle: "Original Title",
    tagline: "Tagline",
    synopsis: "Synopsis",
    releaseDate: now,
    runtime: NonNegativeInt.reconstitute(120),
    status: MovieStatus.reconstitute(MovieStatusEnum.RELEASED),
    ageRating: AgeRating.reconstitute(AgeRatingEnum.L),
    languageId: Uuid.reconstitute("lang-id"),
    budget: NonNegativeNumber.reconstitute(1000000),
    revenue: NonNegativeNumber.reconstitute(5000000),
    posterUrl: Url.reconstitute("https://example.com/poster.jpg"),
    backdropUrl: Url.reconstitute("https://example.com/backdrop.jpg"),
    trailerUrl: Url.reconstitute("https://example.com/trailer.mp4"),
    votes: NonNegativeInt.reconstitute(100),
    score: NonNegativeNumber.reconstitute(8.5),
    isPublic: true,
    createdAt: now,
    updatedAt: now,
    userId: Uuid.reconstitute("user-id")
  });
}

describe("MovieMapper", () => {
  describe("toDTO", () => {
    it("maps movie entity to DTO without user", () => {
      const movie = makeMovie();
      const dto = MovieMapper.toDTO(movie);

      expect(dto.id).toBe("movie-id");
      expect(dto.title).toBe("Test Movie");
      expect(dto.runtime).toBe(120);
      expect(dto.status).toBe("RELEASED");
      expect(dto.ageRating).toBe("L");
      expect(dto.votes).toBe(100);
      expect(dto.score).toBe(8.5);
      expect(dto.isPublic).toBe(true);
      expect(dto.userId).toBe("user-id");
      expect(dto.user).toBeUndefined();
    });

    it("maps movie entity to DTO with user info", () => {
      const movie = makeMovie();
      const user = { id: "user-id", name: "John", avatarUrl: null };
      const dto = MovieMapper.toDTO(movie, user);

      expect(dto.user).toEqual(user);
    });
  });

  describe("fromDto", () => {
    it("converts DTO back to Movie entity", () => {
      const movie = makeMovie();
      const dto = MovieMapper.toDTO(movie);
      const restored = MovieMapper.fromDto(dto);

      expect(restored.id.toString()).toBe(dto.id);
      expect(restored.title).toBe(dto.title);
      expect(restored.runtime.toNumber()).toBe(dto.runtime);
      expect(restored.votes.toNumber()).toBe(dto.votes);
      expect(restored.score.toNumber()).toBe(dto.score);
      expect(restored.isPublic).toBe(dto.isPublic);
    });
  });
});
