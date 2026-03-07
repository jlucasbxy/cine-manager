import { RemoveMovieFromList } from "@/application/use-cases/movie-list/remove-movie-from-list.use-case";
import { MovieListNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { makeMovieListDeps } from "../../../../factories";

describe("RemoveMovieFromList", () => {
  const { mockRepos: repos, transactionManager } = makeMovieListDeps();
  const useCase = new RemoveMovieFromList(
    transactionManager as unknown as ConstructorParameters<
      typeof RemoveMovieFromList
    >[0]
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("removes movie from list successfully", async () => {
    repos.movieListRepository.removeMovieByListIdAndMovieId.mockResolvedValue(
      true
    );
    repos.movieRepository.hardDeleteIfSoftDeletedAndOrphan.mockResolvedValue(
      true
    );

    await expect(
      useCase.execute(
        Uuid.generate().toString(),
        Uuid.generate().toString(),
        Uuid.generate().toString()
      )
    ).resolves.toBeUndefined();

    expect(
      repos.movieRepository.hardDeleteIfSoftDeletedAndOrphan
    ).toHaveBeenCalledTimes(1);
  });

  it("throws MovieListNotFoundError when not found", async () => {
    repos.movieListRepository.removeMovieByListIdAndMovieId.mockResolvedValue(
      false
    );

    await expect(
      useCase.execute(
        Uuid.generate().toString(),
        Uuid.generate().toString(),
        Uuid.generate().toString()
      )
    ).rejects.toThrow(MovieListNotFoundError);

    expect(
      repos.movieRepository.hardDeleteIfSoftDeletedAndOrphan
    ).not.toHaveBeenCalled();
  });
});
