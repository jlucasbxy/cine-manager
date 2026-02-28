import type { AgeRating, MovieStatus } from "@repo/dtos";
import { Film, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
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
import { useDebounce } from "@/hooks/use-debounce";
import { useMovies } from "@/queries/use-movies";

function parseFilters(params: URLSearchParams): MovieFiltersState {
  const runtime = params.get("runtime");
  const status = params.get("status") as MovieStatus | null;
  const ageRating = params.get("ageRating") as AgeRating | null;
  const onlyMine = params.get("onlyMine");
  const genreIds = params.getAll("genreIds");
  return {
    runtime: runtime ? Number(runtime) : undefined,
    releaseDateStart: params.get("releaseDateStart") ?? undefined,
    releaseDateEnd: params.get("releaseDateEnd") ?? undefined,
    status: status ?? undefined,
    ageRating: ageRating ?? undefined,
    onlyMine: onlyMine === "true" ? true : undefined,
    genreIds: genreIds.length > 0 ? genreIds : undefined
  };
}

export function MovieListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const cursor = searchParams.get("cursor") ?? undefined;
  const [cursorStack, setCursorStack] = useState<Array<string | undefined>>([]);
  const urlSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 400);
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const updateParams = (
    updates: Record<string, string | undefined>,
    options: { replace?: boolean } = {}
  ) => {
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
    }, options);
  };

  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      setCursorStack([]);
      updateParams(
        { search: debouncedSearch || undefined, cursor: undefined },
        { replace: true }
      );
    }
  }, [debouncedSearch, urlSearch]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleFiltersChange = (newFilters: MovieFiltersState) => {
    setCursorStack([]);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const scalars: Record<string, string | undefined> = {
          runtime: newFilters.runtime?.toString(),
          releaseDateStart: newFilters.releaseDateStart,
          releaseDateEnd: newFilters.releaseDateEnd,
          status: newFilters.status,
          ageRating: newFilters.ageRating,
          onlyMine: newFilters.onlyMine ? "true" : undefined,
          cursor: undefined
        };
        for (const [key, value] of Object.entries(scalars)) {
          if (value !== undefined && value !== "") next.set(key, value);
          else next.delete(key);
        }
        next.delete("genreIds");
        for (const id of newFilters.genreIds ?? []) next.append("genreIds", id);
        return next;
      },
      { replace: true }
    );
  };

  const handleNext = () => {
    setCursorStack((prev) => [...prev, cursor]);
    updateParams({ cursor: data?.meta.nextCursor ?? undefined });
  };

  const handlePrev = () => {
    setCursorStack((prev) => {
      const next = prev.slice(0, -1);
      updateParams({ cursor: prev.at(-1) });
      return next;
    });
  };

  const queryFilters = useMemo(
    () => ({
      cursor,
      limit: 10,
      runtime: filters.runtime,
      releaseDateStart: filters.releaseDateStart,
      releaseDateEnd: filters.releaseDateEnd,
      status: filters.status,
      ageRating: filters.ageRating,
      search: debouncedSearch || undefined,
      onlyMine: filters.onlyMine,
      genreIds: filters.genreIds
    }),
    [cursor, filters, debouncedSearch]
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
              hasNextPage={data.meta.hasNextPage}
              hasPrevPage={cursorStack.length > 0}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}
        </>
      )}
    </div>
  );
}
