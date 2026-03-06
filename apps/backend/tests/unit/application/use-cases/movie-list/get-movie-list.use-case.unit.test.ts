import { GetMovieList } from "@/application/use-cases/movie-list/get-movie-list.use-case";
import { UnauthorizedError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { makeMovieList, makeMovieListDeps } from "../../../../factories";

describe("GetMovieList", () => {
  const { mockRepos } = makeMovieListDeps();
  const movieListRepository = mockRepos.movieListRepository;
  const useCase = new GetMovieList(movieListRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns movie list DTO with movies when found", async () => {
    const list = makeMovieList({ name: "Favorites", userId: Uuid.generate() });
    movieListRepository.findByIdAndUserIdWithMovies.mockResolvedValue({
      ...list,
      movies: []
    });

    const result = await useCase.execute(
      list.id.toString(),
      list.userId.toString()
    );

    expect(result.name).toBe("Favorites");
    expect(result.movies).toEqual([]);
  });

  it("throws UnauthorizedError when list not found", async () => {
    movieListRepository.findByIdAndUserIdWithMovies.mockResolvedValue(null);

    await expect(
      useCase.execute(Uuid.generate().toString(), Uuid.generate().toString())
    ).rejects.toThrow(UnauthorizedError);
  });
});
