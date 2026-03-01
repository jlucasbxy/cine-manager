import { ListMovies } from "@/application/use-cases/movie/list-movies.use-case";
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
import { PaginatedResult } from "@/domain/value-objects/paginated-result.value-object";

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

describe("ListMovies", () => {
  const movieRepository = { findAll: vi.fn() };
  const useCase = new ListMovies(movieRepository as any);
  const userId = Uuid.generate().toString();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated movies", async () => {
    const movie = makeMovie();
    movieRepository.findAll.mockResolvedValue(
      PaginatedResult.create([movie], null, false)
    );

    const result = await useCase.execute({ limit: 10 }, userId);

    expect(result.data).toHaveLength(1);
    expect(result.meta.limit).toBe(10);
    expect(result.meta.hasNextPage).toBe(false);
  });

  it("returns empty list", async () => {
    movieRepository.findAll.mockResolvedValue(
      PaginatedResult.create([], null, false)
    );

    const result = await useCase.execute({ limit: 10 }, userId);

    expect(result.data).toHaveLength(0);
  });
});
