import type { LanguageDTO } from "@repo/dtos";
import { apiClient } from "@/lib/api-client";

export async function listLanguages() {
  const response = await apiClient.get<LanguageDTO[]>("/languages");
  return response.data;
}
