import type { LanguageDTO } from "@repo/dtos";
import type { LanguageService } from "@/application/interfaces/services";
import type { ListLanguages } from "@/application/use-cases/language";

export class LanguageServiceImpl implements LanguageService {
  constructor(private readonly listLanguagesUseCase: ListLanguages) {}

  async listLanguages(): Promise<LanguageDTO[]> {
    return this.listLanguagesUseCase.execute();
  }
}
