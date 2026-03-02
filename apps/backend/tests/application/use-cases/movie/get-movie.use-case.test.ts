import { GetMovie } from "@/application/use-cases/movie/get-movie.use-case";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { makeMovie } from "../../../factories";

describe("GetMovie", () => {
  const movieRepository = {
    findPublicOrOwnedByIdWithCreator: vi.fn()
  };
  const useCase = new GetMovie(movieRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns movie DTO when found", async () => {
    const movie = makeMovie({ title: "Test" });
    const user = { id: "user-id", name: "John", avatarUrl: null };
    movieRepository.findPublicOrOwnedByIdWithCreator.mockResolvedValue({
      movie,
      user
    });

    const result = await useCase.execute({
      id: movie.id.toString(),
      currentUserId: Uuid.generate().toString()
    });

    expect(result.title).toBe("Test");
    expect(result.user).toEqual(user);
  });

  it("throws MovieNotFoundError when not found", async () => {
    movieRepository.findPublicOrOwnedByIdWithCreator.mockResolvedValue(null);

    await expect(
      useCase.execute({
        id: Uuid.generate().toString(),
        currentUserId: Uuid.generate().toString()
      })
    ).rejects.toThrow(MovieNotFoundError);
  });
});
