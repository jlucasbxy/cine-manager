import { ListLanguages } from "@/application/use-cases/language/list-languages.use-case";

describe("ListLanguages", () => {
  const languageRepository = { findAll: vi.fn() };
  const useCase = new ListLanguages(languageRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all languages", async () => {
    const languages = [
      { id: "1", name: "English" },
      { id: "2", name: "Portuguese" }
    ];
    languageRepository.findAll.mockResolvedValue(languages);

    const result = await useCase.execute();

    expect(result).toEqual(languages);
  });

  it("returns empty array when no languages", async () => {
    languageRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
