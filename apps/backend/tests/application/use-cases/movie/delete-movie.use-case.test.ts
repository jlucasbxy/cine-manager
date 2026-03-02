import { DeleteMovie } from "@/application/use-cases/movie/delete-movie.use-case";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

describe("DeleteMovie", () => {
  const mockRepos = {
    movieRepository: { deleteByIdAndUserId: vi.fn() },
    outboxEventRepository: { deletePendingByResourceId: vi.fn() }
  };
  const transactionManager = {
    execute: vi.fn((fn: any) => fn(mockRepos))
  };
  const useCase = new DeleteMovie(transactionManager as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes pending outbox events and movie successfully", async () => {
    mockRepos.outboxEventRepository.deletePendingByResourceId.mockResolvedValue(1);
    mockRepos.movieRepository.deleteByIdAndUserId.mockResolvedValue(true);
    const id = Uuid.generate().toString();
    const userId = Uuid.generate().toString();

    await expect(useCase.execute(id, userId)).resolves.toBeUndefined();

    expect(
      mockRepos.outboxEventRepository.deletePendingByResourceId
    ).toHaveBeenCalledTimes(1);
    expect(
      mockRepos.movieRepository.deleteByIdAndUserId
    ).toHaveBeenCalledTimes(1);
  });

  it("throws MovieNotFoundError when movie not found", async () => {
    mockRepos.outboxEventRepository.deletePendingByResourceId.mockResolvedValue(0);
    mockRepos.movieRepository.deleteByIdAndUserId.mockResolvedValue(false);
    const id = Uuid.generate().toString();
    const userId = Uuid.generate().toString();

    await expect(useCase.execute(id, userId)).rejects.toThrow(
      MovieNotFoundError
    );
  });
});
