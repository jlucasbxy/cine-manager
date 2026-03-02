import { RateMovie } from "@/application/use-cases/movie/rate-movie.use-case";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { Rating } from "@/domain/entities/rating.entity";
import { RatingValue } from "@/domain/value-objects/rating-value.value-object";
import { makeMovie as makeMovieFactory, makeMovieDeps } from "../../../factories";

function makeMovie(id?: Uuid) {
  return makeMovieFactory({
    id: id ?? Uuid.generate(),
    title: "Test",
    votes: 10,
    score: 7.5
  });
}

describe("RateMovie", () => {
  const { mockRepos, transactionManager } = makeMovieDeps();
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
