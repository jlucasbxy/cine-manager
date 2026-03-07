import { AddMovieToList } from "@/application/use-cases/movie-list/add-movie-to-list.use-case";
import { MovieListNotFoundError, MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { makeMovieListDeps } from "../../../../factories";

describe("AddMovieToList", () => {
  const { mockRepos } = makeMovieListDeps();
  const movieListRepository = mockRepos.movieListRepository;
  const useCase = new AddMovieToList(
    movieListRepository as unknown as ConstructorParameters<
      typeof AddMovieToList
    >[0]
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds movie to list successfully", async () => {
    movieListRepository.addMovie.mockResolvedValue("ok");

    await expect(
      useCase.execute(Uuid.generate().toString(), Uuid.generate().toString(), {
        movieId: Uuid.generate().toString()
      })
    ).resolves.toBeUndefined();
  });

  it("throws MovieListNotFoundError when list not found", async () => {
    movieListRepository.addMovie.mockResolvedValue("list_not_found");

    await expect(
      useCase.execute(Uuid.generate().toString(), Uuid.generate().toString(), {
        movieId: Uuid.generate().toString()
      })
    ).rejects.toThrow(MovieListNotFoundError);
  });

  it("throws MovieNotFoundError when movie not found", async () => {
    movieListRepository.addMovie.mockResolvedValue("movie_not_found");

    await expect(
      useCase.execute(Uuid.generate().toString(), Uuid.generate().toString(), {
        movieId: Uuid.generate().toString()
      })
    ).rejects.toThrow(MovieNotFoundError);
  });
});
