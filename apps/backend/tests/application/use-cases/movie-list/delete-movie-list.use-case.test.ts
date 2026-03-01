import { DeleteMovieList } from "@/application/use-cases/movie-list/delete-movie-list.use-case";
import { UnauthorizedError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

describe("DeleteMovieList", () => {
  const movieListRepository = { deleteByIdAndUserId: vi.fn() };
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

  it("throws UnauthorizedError when list not found", async () => {
    movieListRepository.deleteByIdAndUserId.mockResolvedValue(false);

    await expect(
      useCase.execute(Uuid.generate().toString(), Uuid.generate().toString())
    ).rejects.toThrow(UnauthorizedError);
  });
});
