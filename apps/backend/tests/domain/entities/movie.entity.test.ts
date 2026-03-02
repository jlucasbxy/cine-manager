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

function makeMovieProps() {
  return {
    title: "Test Movie",
    originalTitle: "Test Movie Original",
    tagline: "A test tagline",
    synopsis: "A test synopsis",
    releaseDate: new Date("2024-06-01"),
    runtime: NonNegativeInt.create(120),
    status: MovieStatus.create(MovieStatusEnum.RELEASED),
    ageRating: AgeRating.create(AgeRatingEnum.L),
    languageId: Uuid.generate(),
    budget: NonNegativeNumber.create(1000000),
    revenue: NonNegativeNumber.create(5000000),
    posterUrl: Url.create("https://example.com/poster.jpg"),
    backdropUrl: Url.create("https://example.com/backdrop.jpg"),
    trailerUrl: Url.create("https://example.com/trailer.mp4"),
    userId: Uuid.generate()
  };
}

describe("Movie", () => {
  describe("create", () => {
    it("generates UUID, sets votes=0, score=0, isPublic=true by default", () => {
      const movie = Movie.create(makeMovieProps());

      expect(movie.id.toString()).toBeTruthy();
      expect(movie.title).toBe("Test Movie");
      expect(movie.votes.toNumber()).toBe(0);
      expect(movie.score.toNumber()).toBe(0);
      expect(movie.isPublic).toBe(true);
      expect(movie.deletedAt).toBeNull();
      expect(movie.createdAt).toBeInstanceOf(Date);
    });

    it("respects isPublic=false", () => {
      const movie = Movie.create({ ...makeMovieProps(), isPublic: false });
      expect(movie.isPublic).toBe(false);
    });
  });

  describe("reconstitute", () => {
    it("preserves all given props", () => {
      const id = Uuid.generate();
      const now = new Date();
      const props = {
        ...makeMovieProps(),
        id,
        votes: NonNegativeInt.create(100),
        score: NonNegativeNumber.create(8.5),
        isPublic: false,
        createdAt: now,
        updatedAt: now
      };
      const movie = Movie.reconstitute(props);

      expect(movie.id).toBe(id);
      expect(movie.votes.toNumber()).toBe(100);
      expect(movie.score.toNumber()).toBe(8.5);
      expect(movie.isPublic).toBe(false);
      expect(movie.deletedAt).toBeNull();
    });
  });
});
