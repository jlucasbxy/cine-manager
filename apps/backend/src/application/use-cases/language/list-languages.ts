import type { LanguageRepository } from "@/application/interfaces/repositories";
import type { LanguageDTO } from "@repo/dtos";

export class ListLanguages {
  constructor(
    private readonly languageRepository: LanguageRepository
  ) {}

  async execute(): Promise<LanguageDTO[]> {
    return this.languageRepository.findAll();
  }
}
