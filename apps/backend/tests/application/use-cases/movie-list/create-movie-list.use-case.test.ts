import { CreateMovieList } from "@/application/use-cases/movie-list/create-movie-list.use-case";
import { Uuid } from "@/domain/value-objects";
import { makeMovieList, makeMovieListDeps } from "../../../factories";

describe("CreateMovieList", () => {
  const { mockRepos } = makeMovieListDeps();
  const movieListRepository = mockRepos.movieListRepository;
  const useCase = new CreateMovieList(movieListRepository as any);
  const userId = Uuid.generate();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a movie list and returns DTO", async () => {
    const list = makeMovieList({ name: "Favorites", userId });
    movieListRepository.create.mockResolvedValue(list);

    const result = await useCase.execute(userId.toString(), {
      name: "Favorites"
    });

    expect(result.name).toBe("Favorites");
    expect(movieListRepository.create).toHaveBeenCalled();
  });
});
