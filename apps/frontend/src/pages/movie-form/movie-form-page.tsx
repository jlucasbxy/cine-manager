import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { MovieForm } from "@/components/movie-form/movie-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateMovie, useMovie, useUpdateMovie } from "@/queries/use-movies";

export function MovieFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: movie, isLoading } = useMovie(id ?? "");
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();

  const handleSubmit = async (
    data: Parameters<typeof createMovie.mutateAsync>[0]
  ) => {
    try {
      if (isEdit && id) {
        await updateMovie.mutateAsync({ id, data });
        toast.success("Movie updated");
        navigate(`/movies/${id}`, { replace: true });
      } else {
        const created = await createMovie.mutateAsync(data);
        toast.success("Movie created");
        navigate(`/movies/${created.id}`, { replace: true });
      }
    } catch {
      toast.error(isEdit ? "Failed to update movie" : "Failed to create movie");
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isEdit && !movie) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-semibold">Movie not found</h2>
        <Link to="/movies">
          <Button variant="link">Back to movies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Link to={isEdit ? `/movies/${id}` : "/movies"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Movie" : "Add Movie"}
        </h1>
      </div>

      <MovieForm
        defaultValues={movie}
        onSubmit={handleSubmit}
        isSubmitting={createMovie.isPending || updateMovie.isPending}
        submitLabel={isEdit ? "Save Changes" : "Create Movie"}
      />
    </div>
  );
}
