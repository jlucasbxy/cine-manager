import { ListMovieLists } from "@/application/use-cases/movie-list/list-movie-lists.use-case";
import { MovieList } from "@/domain/entities/movie-list.entity";
import { Uuid } from "@/domain/value-objects";

describe("ListMovieLists", () => {
  const movieListRepository = { findAllByUserId: vi.fn() };
  const useCase = new ListMovieLists(movieListRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns array of movie list DTOs", async () => {
    const userId = Uuid.generate();
    const list = MovieList.reconstitute({
      id: Uuid.generate(),
      name: "Favorites",
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    movieListRepository.findAllByUserId.mockResolvedValue([list]);

    const result = await useCase.execute(userId.toString());

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Favorites");
  });

  it("returns empty array when no lists", async () => {
    movieListRepository.findAllByUserId.mockResolvedValue([]);

    const result = await useCase.execute(Uuid.generate().toString());

    expect(result).toEqual([]);
  });
});
