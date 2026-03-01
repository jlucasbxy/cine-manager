import { RemoveMovieFromList } from "@/application/use-cases/movie-list/remove-movie-from-list.use-case";
import { MovieListNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

describe("RemoveMovieFromList", () => {
  const movieListRepository = { removeMovieByListIdAndMovieId: vi.fn() };
  const useCase = new RemoveMovieFromList(movieListRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("removes movie from list successfully", async () => {
    movieListRepository.removeMovieByListIdAndMovieId.mockResolvedValue(true);

    await expect(
      useCase.execute(
        Uuid.generate().toString(),
        Uuid.generate().toString(),
        Uuid.generate().toString()
      )
    ).resolves.toBeUndefined();
  });

  it("throws MovieListNotFoundError when not found", async () => {
    movieListRepository.removeMovieByListIdAndMovieId.mockResolvedValue(false);

    await expect(
      useCase.execute(
        Uuid.generate().toString(),
        Uuid.generate().toString(),
        Uuid.generate().toString()
      )
    ).rejects.toThrow(MovieListNotFoundError);
  });
});
