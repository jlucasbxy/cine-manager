import { CreateMovieList } from "@/application/use-cases/movie-list/create-movie-list.use-case";
import { MovieList } from "@/domain/entities/movie-list.entity";
import { Uuid } from "@/domain/value-objects";

describe("CreateMovieList", () => {
  const movieListRepository = { create: vi.fn() };
  const useCase = new CreateMovieList(movieListRepository as any);
  const userId = Uuid.generate();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a movie list and returns DTO", async () => {
    const list = MovieList.reconstitute({
      id: Uuid.generate(),
      name: "Favorites",
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    movieListRepository.create.mockResolvedValue(list);

    const result = await useCase.execute(userId.toString(), {
      name: "Favorites"
    });

    expect(result.name).toBe("Favorites");
    expect(movieListRepository.create).toHaveBeenCalled();
  });
});
