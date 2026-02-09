import { ListLanguages } from "@/application/use-cases/language";
import { makeLanguageRepository } from "@/main/factories/repositories";

export function makeListLanguages(): ListLanguages {
  return new ListLanguages(
    makeLanguageRepository()
  );
}
