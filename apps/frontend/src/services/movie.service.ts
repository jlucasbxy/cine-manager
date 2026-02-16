import type {
  CreateMovieDTO,
  MovieDTO,
  PaginatedResultDTO,
  QueryMoviesDTO,
  UpdateMovieDTO
} from "@repo/dtos";
import { apiClient } from "@/lib/api-client";

export async function listMovies(query: Partial<QueryMoviesDTO>) {
  const response = await apiClient.get<PaginatedResultDTO<MovieDTO>>(
    "/movies",
    { params: query }
  );
  return response.data;
}

export async function getMovie(id: string) {
  const response = await apiClient.get<MovieDTO>(`/movies/${id}`);
  return response.data;
}

export async function createMovie(data: CreateMovieDTO) {
  const response = await apiClient.post<MovieDTO>("/movies", data);
  return response.data;
}

export async function updateMovie(id: string, data: UpdateMovieDTO) {
  const response = await apiClient.put<MovieDTO>(`/movies/${id}`, data);
  return response.data;
}

export async function deleteMovie(id: string) {
  await apiClient.delete(`/movies/${id}`);
}
