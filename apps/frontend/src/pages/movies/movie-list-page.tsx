import { AgeRating, MovieStatus } from "@repo/dtos";
import { Film, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useDebounce } from "@/hooks/use-debounce";
import {
  MovieFilters,
  type MovieFiltersState
} from "@/components/movies/movie-filters";
import { MovieGrid } from "@/components/movies/movie-grid";
import { MoviePagination } from "@/components/movies/movie-pagination";
import { MovieSearchBar } from "@/components/movies/movie-search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovies } from "@/queries/use-movies";

function parseFilters(params: URLSearchParams): MovieFiltersState {
  const runtime = params.get("runtime");
  const status = params.get("status") as MovieStatus | null;
  const ageRating = params.get("ageRating") as AgeRating | null;
  return {
    runtime: runtime ? Number(runtime) : undefined,
    releaseDateStart: params.get("releaseDateStart") ?? undefined,
    releaseDateEnd: params.get("releaseDateEnd") ?? undefined,
    status: status ?? undefined,
    ageRating: ageRating ?? undefined
  };
}

export function MovieListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const urlSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 400);
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const updateParams = (updates: Record<string, string | undefined>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined && value !== "") {
          next.set(key, value);
        } else {
          next.delete(key);
        }
      }
      return next;
    });
  };

  useEffect(() => {
    updateParams({ search: debouncedSearch || undefined, page: undefined });
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleFiltersChange = (newFilters: MovieFiltersState) => {
    updateParams({
      runtime: newFilters.runtime?.toString(),
      releaseDateStart: newFilters.releaseDateStart,
      releaseDateEnd: newFilters.releaseDateEnd,
      status: newFilters.status,
      ageRating: newFilters.ageRating,
      page: undefined
    });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage === 1 ? undefined : String(newPage) });
  };

  const queryFilters = useMemo(
    () => ({
      page,
      perPage: 10,
      runtime: filters.runtime,
      releaseDateStart: filters.releaseDateStart,
      releaseDateEnd: filters.releaseDateEnd,
      status: filters.status,
      ageRating: filters.ageRating,
      search: debouncedSearch || undefined
    }),
    [page, filters, debouncedSearch]
  );

  const { data, isLoading } = useMovies(queryFilters);

  const filteredMovies = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Movies</h1>
        <Link to="/movies/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Movie</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <MovieSearchBar value={searchInput} onChange={handleSearchChange} />
        </div>
        <MovieFilters filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`skeleton-${i.toString()}`} className="space-y-2">
              <Skeleton className="aspect-2/3 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredMovies.length === 0 ? (
        <EmptyState
          icon={<Film className="h-12 w-12" />}
          title="No movies found"
          description={
            searchInput || Object.values(filters).some(Boolean)
              ? "Try adjusting your search or filters"
              : "Get started by adding your first movie"
          }
          action={
            !searchInput && !Object.values(filters).some(Boolean) ? (
              <Link to="/movies/new">
                <Button>Add Movie</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <MovieGrid movies={filteredMovies} />
          {data?.meta && (
            <MoviePagination
              page={data.meta.page}
              totalPages={data.meta.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
