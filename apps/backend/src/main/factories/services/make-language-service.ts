import { LanguageServiceImpl } from "@/infrastructure/services";
import { makeListLanguages } from "@/main/factories/use-cases/language";
import { singleton } from "@/main/factories/singleton";

export const makeLanguageService = singleton(
  () => new LanguageServiceImpl(makeListLanguages())
);
