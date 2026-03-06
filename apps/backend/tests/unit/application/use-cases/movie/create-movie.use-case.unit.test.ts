import { CreateMovie } from "@/application/use-cases/movie/create-movie.use-case";
import { Uuid } from "@/domain/value-objects";
import {
  daysFromNow,
  makeMovie,
  makeMovieDeps,
  makeMovieInput,
  makeUser
} from "../../../../factories";

describe("CreateMovie", () => {
  const { mockRepos, transactionManager } = makeMovieDeps();
  const useCase = new CreateMovie(transactionManager as any);
  const userId = Uuid.generate();

  const input = makeMovieInput();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a movie and returns DTO", async () => {
    const movie = makeMovie({
      title: input.title,
      originalTitle: input.originalTitle,
      tagline: input.tagline,
      synopsis: input.synopsis,
      releaseDate: new Date("2020-06-01"),
      runtime: input.runtime,
      status: input.status,
      ageRating: input.ageRating,
      languageId: Uuid.reconstitute(input.languageId),
      budget: input.budget,
      revenue: input.revenue,
      posterUrl: input.posterUrl,
      backdropUrl: input.backdropUrl,
      trailerUrl: input.trailerUrl,
      userId
    });
    mockRepos.movieRepository.create.mockResolvedValue(movie);

    const result = await useCase.execute(userId.toString(), input);

    expect(result.title).toBe("Test Movie");
    expect(mockRepos.movieRepository.create).toHaveBeenCalled();
  });

  it("creates outbox event when release date is in the future", async () => {
    const futureInput = { ...input, releaseDate: daysFromNow(30) };
    const movie = makeMovie({
      title: futureInput.title,
      originalTitle: futureInput.originalTitle,
      tagline: futureInput.tagline,
      synopsis: futureInput.synopsis,
      releaseDate: futureInput.releaseDate,
      runtime: futureInput.runtime,
      status: futureInput.status,
      ageRating: futureInput.ageRating,
      languageId: Uuid.reconstitute(input.languageId),
      budget: futureInput.budget,
      revenue: futureInput.revenue,
      posterUrl: futureInput.posterUrl,
      backdropUrl: futureInput.backdropUrl,
      trailerUrl: futureInput.trailerUrl,
      userId
    });
    mockRepos.movieRepository.create.mockResolvedValue(movie);

    const user = makeUser({ id: userId, email: "john@example.com", password: "hashed" });
    mockRepos.userRepository.findById.mockResolvedValue(user);
    mockRepos.outboxEventRepository.create.mockResolvedValue(undefined);

    await useCase.execute(userId.toString(), futureInput);

    expect(mockRepos.outboxEventRepository.create).toHaveBeenCalled();
  });
});
