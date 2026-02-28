import type { LanguageDTO } from "@repo/dtos";

export interface LanguageService {
  listLanguages(): Promise<LanguageDTO[]>;
}
