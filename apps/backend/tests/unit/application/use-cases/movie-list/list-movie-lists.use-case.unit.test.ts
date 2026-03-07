import { ListMovieLists } from "@/application/use-cases/movie-list/list-movie-lists.use-case";
import { Uuid } from "@/domain/value-objects";
import { makeMovieList, makeMovieListDeps } from "../../../../factories";

describe("ListMovieLists", () => {
  const { mockRepos } = makeMovieListDeps();
  const movieListRepository = mockRepos.movieListRepository;
  const useCase = new ListMovieLists(
    movieListRepository as unknown as ConstructorParameters<
      typeof ListMovieLists
    >[0]
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns array of movie list DTOs", async () => {
    const userId = Uuid.generate();
    const list = makeMovieList({ name: "Favorites", userId });
    movieListRepository.findAllByUserId.mockResolvedValue([list]);

    const result = await useCase.execute(userId.toString());

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Favorites");
  });

  it("returns empty array when no lists", async () => {
    movieListRepository.findAllByUserId.mockResolvedValue([]);

    const result = await useCase.execute(Uuid.generate().toString());

    expect(result).toEqual([]);
  });
});
