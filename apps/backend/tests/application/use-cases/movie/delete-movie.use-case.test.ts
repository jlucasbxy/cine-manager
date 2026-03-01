import { DeleteMovie } from "@/application/use-cases/movie/delete-movie.use-case";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

describe("DeleteMovie", () => {
  const movieRepository = { deleteByIdAndUserId: vi.fn() };
  const useCase = new DeleteMovie(movieRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes movie successfully", async () => {
    movieRepository.deleteByIdAndUserId.mockResolvedValue(true);
    const id = Uuid.generate().toString();
    const userId = Uuid.generate().toString();

    await expect(useCase.execute(id, userId)).resolves.toBeUndefined();
  });

  it("throws MovieNotFoundError when movie not found", async () => {
    movieRepository.deleteByIdAndUserId.mockResolvedValue(false);
    const id = Uuid.generate().toString();
    const userId = Uuid.generate().toString();

    await expect(useCase.execute(id, userId)).rejects.toThrow(
      MovieNotFoundError
    );
  });
});
