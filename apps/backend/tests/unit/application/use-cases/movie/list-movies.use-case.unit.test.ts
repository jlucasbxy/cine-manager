import { ListMovies } from "@/application/use-cases/movie/list-movies.use-case";
import { Uuid } from "@/domain/value-objects";
import { PaginatedResult } from "@/domain/value-objects/paginated-result.value-object";
import { makeMovie } from "../../../../factories";

describe("ListMovies", () => {
  const movieRepository = { findAll: vi.fn() };
  const useCase = new ListMovies(movieRepository as any);
  const userId = Uuid.generate().toString();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated movies", async () => {
    const movie = makeMovie();
    movieRepository.findAll.mockResolvedValue(
      PaginatedResult.create([movie], null, false)
    );

    const result = await useCase.execute({ limit: 10 }, userId);

    expect(result.data).toHaveLength(1);
    expect(result.meta.limit).toBe(10);
    expect(result.meta.hasNextPage).toBe(false);
  });

  it("returns empty list", async () => {
    movieRepository.findAll.mockResolvedValue(
      PaginatedResult.create([], null, false)
    );

    const result = await useCase.execute({ limit: 10 }, userId);

    expect(result.data).toHaveLength(0);
  });
});
