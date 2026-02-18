import { Film, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
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

export function MovieListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<MovieFiltersState>({});

  const queryFilters = useMemo(
    () => ({
      page,
      perPage: 10,
      runtime: filters.runtime,
      releaseDateStart: filters.releaseDateStart,
      releaseDateEnd: filters.releaseDateEnd
    }),
    [page, filters]
  );

  const { data, isLoading } = useMovies(queryFilters);

  const filteredMovies = useMemo(() => {
    if (!data?.data) return [];
    let movies = data.data;

    if (search) {
      const lower = search.toLowerCase();
      movies = movies.filter((m) => m.title.toLowerCase().includes(lower));
    }

    if (filters.status) {
      movies = movies.filter((m) => m.status === filters.status);
    }

    if (filters.ageRating) {
      movies = movies.filter((m) => m.ageRating === filters.ageRating);
    }

    return movies;
  }, [data?.data, search, filters.status, filters.ageRating]);

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
          <MovieSearchBar value={search} onChange={setSearch} />
        </div>
        <MovieFilters filters={filters} onFiltersChange={setFilters} />
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
            search || Object.values(filters).some(Boolean)
              ? "Try adjusting your search or filters"
              : "Get started by adding your first movie"
          }
          action={
            !search && !Object.values(filters).some(Boolean) ? (
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
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
