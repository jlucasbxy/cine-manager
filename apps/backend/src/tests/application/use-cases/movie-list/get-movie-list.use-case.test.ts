import { GetMovieList } from "@/application/use-cases/movie-list/get-movie-list.use-case";
import { MovieList } from "@/domain/entities/movie-list.entity";
import { UnauthorizedError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

describe("GetMovieList", () => {
  const movieListRepository = {
    findByIdAndUserIdWithMovies: vi.fn()
  };
  const useCase = new GetMovieList(movieListRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns movie list DTO with movies when found", async () => {
    const list = MovieList.reconstitute({
      id: Uuid.generate(),
      name: "Favorites",
      userId: Uuid.generate(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
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
