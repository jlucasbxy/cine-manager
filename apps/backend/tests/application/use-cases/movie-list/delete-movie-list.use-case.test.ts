import { DeleteMovieList } from "@/application/use-cases/movie-list/delete-movie-list.use-case";
import { MovieListNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { makeMovieListDeps } from "../../../factories";

describe("DeleteMovieList", () => {
  const { mockRepos } = makeMovieListDeps();
  const movieListRepository = mockRepos.movieListRepository;
  const useCase = new DeleteMovieList(movieListRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes list successfully", async () => {
    movieListRepository.deleteByIdAndUserId.mockResolvedValue(true);

    await expect(
      useCase.execute(Uuid.generate().toString(), Uuid.generate().toString())
    ).resolves.toBeUndefined();
  });

  it("throws MovieListNotFoundError when list not found", async () => {
    movieListRepository.deleteByIdAndUserId.mockResolvedValue(false);

    await expect(
      useCase.execute(Uuid.generate().toString(), Uuid.generate().toString())
    ).rejects.toThrow(MovieListNotFoundError);
  });
});
