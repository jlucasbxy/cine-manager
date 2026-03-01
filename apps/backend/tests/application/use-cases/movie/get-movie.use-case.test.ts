import { GetMovie } from "@/application/use-cases/movie/get-movie.use-case";
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

describe("GetMovie", () => {
  const movieRepository = {
    findPublicOrOwnedByIdWithCreator: vi.fn()
  };
  const useCase = new GetMovie(movieRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns movie DTO when found", async () => {
    const movie = makeMovie();
    const user = { id: "user-id", name: "John", avatarUrl: null };
    movieRepository.findPublicOrOwnedByIdWithCreator.mockResolvedValue({
      movie,
      user
    });

    const result = await useCase.execute({
      id: movie.id.toString(),
      currentUserId: Uuid.generate().toString()
    });

    expect(result.title).toBe("Test");
    expect(result.user).toEqual(user);
  });

  it("throws MovieNotFoundError when not found", async () => {
    movieRepository.findPublicOrOwnedByIdWithCreator.mockResolvedValue(null);

    await expect(
      useCase.execute({
        id: Uuid.generate().toString(),
        currentUserId: Uuid.generate().toString()
      })
    ).rejects.toThrow(MovieNotFoundError);
  });
});
