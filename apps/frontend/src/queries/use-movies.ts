import type {
  CreateMovieDTO,
  QueryMoviesDTO,
  UpdateMovieDTO
} from "@repo/dtos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/queries/query-keys";
import * as movieService from "@/services/movie.service";

export function useMovies(filters: Partial<QueryMoviesDTO>) {
  return useQuery({
    queryKey: queryKeys.movies.list(filters),
    queryFn: () => movieService.listMovies(filters)
  });
}

export function useMovie(id: string) {
  return useQuery({
    queryKey: queryKeys.movies.detail(id),
    queryFn: () => movieService.getMovie(id),
    enabled: !!id
  });
}

export function useCreateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMovieDTO) => movieService.createMovie(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
    }
  });
}

export function useUpdateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMovieDTO }) =>
      movieService.updateMovie(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
    }
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => movieService.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
    }
  });
}
