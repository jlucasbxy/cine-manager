import type { GenreDTO } from "@repo/dtos";
import { apiClient } from "@/lib/api-client";

export async function listGenres() {
  const response = await apiClient.get<GenreDTO[]>("/genres");
  return response.data;
}
