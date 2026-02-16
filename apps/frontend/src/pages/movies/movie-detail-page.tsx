import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  ExternalLink,
  Star,
  Trash2,
  Users
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteMovie, useMovie } from "@/queries/use-movies";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function MovieDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: movie, isLoading } = useMovie(id);
  const deleteMovie = useDeleteMovie();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMovie.mutateAsync(id);
      toast.success("Movie deleted");
      navigate("/movies");
    } catch {
      toast.error("Failed to delete movie");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!movie) {
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/movies">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{movie.title}</h1>
      </div>

      {movie.backdropUrl && (
        <div className="relative h-48 overflow-hidden rounded-lg sm:h-64 md:h-80">
          <img
            src={movie.backdropUrl}
            alt={`${movie.title} backdrop`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div className="mx-auto w-48 md:mx-0 md:w-full">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{movie.title}</h2>
            {movie.originalTitle !== movie.title && (
              <p className="text-sm text-muted-foreground">
                {movie.originalTitle}
              </p>
            )}
            <p className="mt-1 text-sm italic text-muted-foreground">
              {movie.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{movie.ageRating}</Badge>
            <Badge variant="secondary">{movie.status.replace(/_/g, " ")}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(movie.releaseDate), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>
                {movie.score.toFixed(1)} ({movie.votes} votes)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{movie.votes} votes</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 font-semibold">Synopsis</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {movie.synopsis}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Budget</span>
              <p className="font-medium">
                <DollarSign className="mr-1 inline h-3 w-3" />
                {formatCurrency(movie.budget)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Revenue</span>
              <p className="font-medium">
                <DollarSign className="mr-1 inline h-3 w-3" />
                {formatCurrency(movie.revenue)}
              </p>
            </div>
          </div>

          {movie.trailerUrl && (
            <div>
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Watch Trailer
              </a>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Link to={`/movies/${movie.id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete movie"
        description={`Are you sure you want to delete "${movie.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => void handleDelete()}
        loading={deleteMovie.isPending}
      />
    </div>
  );
}
