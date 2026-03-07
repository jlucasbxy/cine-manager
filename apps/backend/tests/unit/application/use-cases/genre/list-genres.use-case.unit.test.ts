import { ListGenres } from "@/application/use-cases/genre/list-genres.use-case";

describe("ListGenres", () => {
  const genreRepository = { findAll: vi.fn() };
  const useCase = new ListGenres(
    genreRepository as unknown as ConstructorParameters<typeof ListGenres>[0]
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all genres", async () => {
    const genres = [
      { id: "1", name: "Action" },
      { id: "2", name: "Drama" }
    ];
    genreRepository.findAll.mockResolvedValue(genres);

    const result = await useCase.execute();

    expect(result).toEqual(genres);
    expect(genreRepository.findAll).toHaveBeenCalled();
  });

  it("returns empty array when no genres", async () => {
    genreRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
