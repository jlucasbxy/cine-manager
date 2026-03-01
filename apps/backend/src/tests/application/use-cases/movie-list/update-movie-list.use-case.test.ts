import { UpdateMovieList } from "@/application/use-cases/movie-list/update-movie-list.use-case";
import { MovieList } from "@/domain/entities/movie-list.entity";
import { MovieListNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

describe("UpdateMovieList", () => {
  const movieListRepository = { updateByIdAndUserId: vi.fn() };
  const useCase = new UpdateMovieList(movieListRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates list name and returns DTO", async () => {
    const list = MovieList.reconstitute({
      id: Uuid.generate(),
      name: "Updated",
      userId: Uuid.generate(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
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
