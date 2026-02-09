import { LanguageServiceImpl } from "@/infra/services";
import { makeListLanguages } from "@/main/factories/use-cases/language";

export function makeLanguageService(): LanguageServiceImpl {
  return new LanguageServiceImpl(
    makeListLanguages()
  );
}
