import { LanguageController } from "@/infrastructure/http/controllers";
import { makeLanguageService } from "@/main/factories/services";

export function makeLanguageController(): LanguageController {
  return new LanguageController(makeLanguageService());
}
