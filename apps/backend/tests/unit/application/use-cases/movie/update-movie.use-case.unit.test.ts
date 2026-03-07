import { UpdateMovie } from "@/application/use-cases/movie/update-movie.use-case";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { makeMovie as makeMovieFactory } from "../../../../factories";

function makeMovie() {
  return makeMovieFactory({ title: "Test" });
}

describe("UpdateMovie", () => {
  const movieRepository = { updateByIdAndUserId: vi.fn() };
  const useCase = new UpdateMovie(
    movieRepository as unknown as ConstructorParameters<typeof UpdateMovie>[0]
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates movie and returns DTO", async () => {
    const movie = makeMovie();
    movieRepository.updateByIdAndUserId.mockResolvedValue(movie);

    const result = await useCase.execute(
      movie.id.toString(),
      movie.userId.toString(),
      { title: "Updated Title" }
    );

    expect(result.title).toBe("Test");
    expect(movieRepository.updateByIdAndUserId).toHaveBeenCalled();
  });

  it("throws MovieNotFoundError when movie not found", async () => {
    movieRepository.updateByIdAndUserId.mockResolvedValue(null);
    const id = Uuid.generate().toString();
    const userId = Uuid.generate().toString();

    await expect(
      useCase.execute(id, userId, { title: "Updated" })
    ).rejects.toThrow(MovieNotFoundError);
  });
});
