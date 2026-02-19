import { LanguageServiceImpl } from "@/infrastructure/services";
import { singleton } from "@/main/factories/singleton.util";
import { makeListLanguages } from "@/main/factories/use-cases/language";

export const makeLanguageService = singleton(
  () => new LanguageServiceImpl(makeListLanguages())
);
