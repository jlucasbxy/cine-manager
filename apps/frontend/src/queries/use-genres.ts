import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/queries/query-keys";
import * as genreService from "@/services/genre.service";

export function useGenres() {
  return useQuery({
    queryKey: queryKeys.genres.all,
    queryFn: () => genreService.listGenres()
  });
}
