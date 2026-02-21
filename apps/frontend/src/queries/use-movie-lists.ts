import type { CreateMovieListDTO, UpdateMovieListDTO } from "@repo/dtos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/queries/query-keys";
import * as movieListService from "@/services/movie-list.service";

export function useLists() {
  return useQuery({
    queryKey: queryKeys.lists.all,
    queryFn: () => movieListService.getLists()
  });
}

export function useList(id: string) {
  return useQuery({
    queryKey: queryKeys.lists.detail(id),
    queryFn: () => movieListService.getList(id),
    enabled: !!id
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMovieListDTO) => movieListService.createList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
    }
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMovieListDTO }) =>
      movieListService.updateList(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.detail(id) });
    }
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => movieListService.deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
    }
  });
}

export function useAddMovieToList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, movieId }: { listId: string; movieId: string }) =>
      movieListService.addMovieToList(listId, { movieId }),
    onSuccess: (_result, { listId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.detail(listId) });
    }
  });
}

export function useRemoveMovieFromList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, movieId }: { listId: string; movieId: string }) =>
      movieListService.removeMovieFromList(listId, movieId),
    onSuccess: (_result, { listId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.detail(listId) });
    }
  });
}
