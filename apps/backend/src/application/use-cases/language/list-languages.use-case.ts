import type { LanguageDTO } from "@repo/dtos";
import type { LanguageRepository } from "@/application/interfaces/repositories";

export class ListLanguages {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async execute(): Promise<LanguageDTO[]> {
    return this.languageRepository.findAll();
  }
}
