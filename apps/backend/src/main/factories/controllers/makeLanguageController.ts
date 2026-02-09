import { LanguageController } from "@/infra/http/controllers";
import { makeLanguageService } from "@/main/factories/services";

export function makeLanguageController(): LanguageController {
  return new LanguageController(
    makeLanguageService()
  );
}
