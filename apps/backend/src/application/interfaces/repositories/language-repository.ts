import type { LanguageDTO } from "@repo/dtos";

export interface LanguageRepository {
  findAll(): Promise<LanguageDTO[]>;
}
