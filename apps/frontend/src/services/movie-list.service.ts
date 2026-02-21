import type {
  AddMovieToListDTO,
  CreateMovieListDTO,
  MovieListDTO,
  UpdateMovieListDTO
} from "@repo/dtos";
import { apiClient } from "@/lib/api-client";

export async function createList(data: CreateMovieListDTO) {
  const response = await apiClient.post<MovieListDTO>("/lists", data);
  return response.data;
}

export async function getLists() {
  const response = await apiClient.get<MovieListDTO[]>("/lists");
  return response.data;
}

export async function getList(id: string) {
  const response = await apiClient.get<MovieListDTO>(`/lists/${id}`);
  return response.data;
}

export async function updateList(id: string, data: UpdateMovieListDTO) {
  const response = await apiClient.put<MovieListDTO>(`/lists/${id}`, data);
  return response.data;
}

export async function deleteList(id: string) {
  await apiClient.delete(`/lists/${id}`);
}

export async function addMovieToList(listId: string, data: AddMovieToListDTO) {
  await apiClient.post(`/lists/${listId}/movies`, data);
}

export async function removeMovieFromList(listId: string, movieId: string) {
  await apiClient.delete(`/lists/${listId}/movies/${movieId}`);
}
