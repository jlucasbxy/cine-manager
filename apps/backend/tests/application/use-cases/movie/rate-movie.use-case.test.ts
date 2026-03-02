import { RateMovie } from "@/application/use-cases/movie/rate-movie.use-case";
import { Movie } from "@/domain/entities/movie.entity";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import { MovieNotFoundError } from "@/domain/errors";
import {
  AgeRating,
  Money,
  MovieStatus,
  NonNegativeInt,
  NonNegativeNumber,
  Url,
  Uuid
} from "@/domain/value-objects";
import { Rating } from "@/domain/entities/rating.entity";
import { RatingValue } from "@/domain/value-objects/rating-value.value-object";

function makeMovie(id?: Uuid) {
  return Movie.reconstitute({
    id: id ?? Uuid.generate(),
    title: "Test",
    originalTitle: "Test",
    tagline: "T",
    synopsis: "S",
    releaseDate: new Date(),
    runtime: NonNegativeInt.reconstitute(120),
    status: MovieStatus.reconstitute(MovieStatusEnum.RELEASED),
    ageRating: AgeRating.reconstitute(AgeRatingEnum.L),
    languageId: Uuid.generate(),
    budget: Money.reconstitute(0),
    revenue: Money.reconstitute(0),
    posterUrl: Url.reconstitute("https://example.com/p.jpg"),
    backdropUrl: Url.reconstitute("https://example.com/b.jpg"),
    trailerUrl: Url.reconstitute("https://example.com/t.mp4"),
    votes: NonNegativeInt.reconstitute(10),
    score: NonNegativeNumber.reconstitute(7.5),
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: Uuid.generate()
  });
}

describe("RateMovie", () => {
  const mockRepos = {
    movieRepository: {
      findByIdForUpdate: vi.fn(),
      update: vi.fn()
    },
    ratingRepository: {
      upsert: vi.fn(),
      getAverageAndCount: vi.fn()
    }
  };
  const transactionManager = {
    execute: vi.fn((fn: any) => fn(mockRepos))
  };
  const useCase = new RateMovie(transactionManager as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rates movie and returns updated DTO", async () => {
    const movieId = Uuid.generate();
    const userId = Uuid.generate();
    const movie = makeMovie(movieId);

    mockRepos.movieRepository.findByIdForUpdate.mockResolvedValue(movie);
    mockRepos.ratingRepository.upsert.mockResolvedValue(
      Rating.create({ userId, movieId, value: RatingValue.create(8) })
    );
    mockRepos.ratingRepository.getAverageAndCount.mockResolvedValue({
      average: 8,
      count: 11
    });
    mockRepos.movieRepository.update.mockResolvedValue(movie);

    const result = await useCase.execute(
      movieId.toString(),
      userId.toString(),
      { value: 8 }
    );

    expect(result.title).toBe("Test");
    expect(mockRepos.ratingRepository.upsert).toHaveBeenCalled();
    expect(mockRepos.movieRepository.update).toHaveBeenCalled();
  });

  it("throws MovieNotFoundError when movie not found", async () => {
    mockRepos.movieRepository.findByIdForUpdate.mockResolvedValue(null);

    await expect(
      useCase.execute(
        Uuid.generate().toString(),
        Uuid.generate().toString(),
        { value: 8 }
      )
    ).rejects.toThrow(MovieNotFoundError);
  });

  it("throws MovieNotFoundError when rating upsert returns null", async () => {
    const movie = makeMovie();
    mockRepos.movieRepository.findByIdForUpdate.mockResolvedValue(movie);
    mockRepos.ratingRepository.upsert.mockResolvedValue(null);

    await expect(
      useCase.execute(
        movie.id.toString(),
        Uuid.generate().toString(),
        { value: 8 }
      )
    ).rejects.toThrow(MovieNotFoundError);
  });
});
