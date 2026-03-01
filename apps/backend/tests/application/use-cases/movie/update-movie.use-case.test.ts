import { UpdateMovie } from "@/application/use-cases/movie/update-movie.use-case";
import { Movie } from "@/domain/entities/movie.entity";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import { MovieNotFoundError } from "@/domain/errors";
import {
  AgeRating,
  MovieStatus,
  NonNegativeInt,
  NonNegativeNumber,
  Url,
  Uuid
} from "@/domain/value-objects";

function makeMovie() {
  return Movie.reconstitute({
    id: Uuid.generate(),
    title: "Test",
    originalTitle: "Test",
    tagline: "T",
    synopsis: "S",
    releaseDate: new Date(),
    runtime: NonNegativeInt.reconstitute(120),
    status: MovieStatus.reconstitute(MovieStatusEnum.RELEASED),
    ageRating: AgeRating.reconstitute(AgeRatingEnum.L),
    languageId: Uuid.generate(),
    budget: NonNegativeNumber.reconstitute(0),
    revenue: NonNegativeNumber.reconstitute(0),
    posterUrl: Url.reconstitute("https://example.com/p.jpg"),
    backdropUrl: Url.reconstitute("https://example.com/b.jpg"),
    trailerUrl: Url.reconstitute("https://example.com/t.mp4"),
    votes: NonNegativeInt.reconstitute(0),
    score: NonNegativeNumber.reconstitute(0),
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: Uuid.generate()
  });
}

describe("UpdateMovie", () => {
  const movieRepository = { updateByIdAndUserId: vi.fn() };
  const useCase = new UpdateMovie(movieRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates movie and returns DTO", async () => {
    const movie = makeMovie();
    movieRepository.updateByIdAndUserId.mockResolvedValue(movie);

    const result = await useCase.execute(
      movie.id.toString(),
      movie.userId.toString(),
      { title: "Updated Title" }
    );

    expect(result.title).toBe("Test");
    expect(movieRepository.updateByIdAndUserId).toHaveBeenCalled();
  });

  it("throws MovieNotFoundError when movie not found", async () => {
    movieRepository.updateByIdAndUserId.mockResolvedValue(null);
    const id = Uuid.generate().toString();
    const userId = Uuid.generate().toString();

    await expect(
      useCase.execute(id, userId, { title: "Updated" })
    ).rejects.toThrow(MovieNotFoundError);
  });
});
