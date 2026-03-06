import { UpdateMovieList } from "@/application/use-cases/movie-list/update-movie-list.use-case";
import { MovieListNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { makeMovieList, makeMovieListDeps } from "../../../../factories";

describe("UpdateMovieList", () => {
  const { mockRepos } = makeMovieListDeps();
  const movieListRepository = mockRepos.movieListRepository;
  const useCase = new UpdateMovieList(movieListRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates list name and returns DTO", async () => {
    const list = makeMovieList({ name: "Updated", userId: Uuid.generate() });
    movieListRepository.updateByIdAndUserId.mockResolvedValue(list);

    const result = await useCase.execute(
      list.id.toString(),
      list.userId.toString(),
      { name: "Updated" }
    );

    expect(result.name).toBe("Updated");
  });

  it("throws MovieListNotFoundError when not found", async () => {
    movieListRepository.updateByIdAndUserId.mockResolvedValue(null);

    await expect(
      useCase.execute(Uuid.generate().toString(), Uuid.generate().toString(), {
        name: "Updated"
      })
    ).rejects.toThrow(MovieListNotFoundError);
  });
});
