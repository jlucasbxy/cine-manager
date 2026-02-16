import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/queries/query-keys";
import * as languageService from "@/services/language.service";

export function useLanguages() {
  return useQuery({
    queryKey: queryKeys.languages.all,
    queryFn: () => languageService.listLanguages()
  });
}
