import { DeleteMovie } from "@/application/use-cases/movie/delete-movie.use-case";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { makeMovieDeps } from "../../../../factories";

describe("DeleteMovie", () => {
  const { mockRepos, transactionManager } = makeMovieDeps();
  const useCase = new DeleteMovie(
    transactionManager as unknown as ConstructorParameters<
      typeof DeleteMovie
    >[0]
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cancels the scheduled release email and deletes the movie successfully", async () => {
    mockRepos.queue.cancel.mockResolvedValue(undefined);
    mockRepos.movieRepository.deleteByIdAndUserId.mockResolvedValue(true);
    mockRepos.movieRepository.hardDeleteIfSoftDeletedAndOrphan.mockResolvedValue(
      true
    );
    const id = Uuid.generate().toString();
    const userId = Uuid.generate().toString();

    await expect(useCase.execute(id, userId)).resolves.toBeUndefined();

    expect(mockRepos.queue.cancel).toHaveBeenCalledWith(
      "movie-release-date",
      id
    );
    expect(mockRepos.movieRepository.deleteByIdAndUserId).toHaveBeenCalledTimes(
      1
    );
  });

  it("throws MovieNotFoundError when movie not found", async () => {
    mockRepos.queue.cancel.mockResolvedValue(undefined);
    mockRepos.movieRepository.deleteByIdAndUserId.mockResolvedValue(false);
    const id = Uuid.generate().toString();
    const userId = Uuid.generate().toString();

    await expect(useCase.execute(id, userId)).rejects.toThrow(
      MovieNotFoundError
    );
  });
});
