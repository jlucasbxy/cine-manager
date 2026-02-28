import { ArrowLeft, Edit2, Film, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { MovieCard } from "@/components/movies/movie-card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteList,
  useList,
  useRemoveMovieFromList,
  useUpdateList
} from "@/queries/use-movie-lists";

export function ListDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: list, isLoading } = useList(id);
  const updateList = useUpdateList();
  const deleteList = useDeleteList();
  const removeMovie = useRemoveMovieFromList();

  const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const handleRename = async () => {
    if (!newName.trim()) return;
    try {
      await updateList.mutateAsync({ id, data: { name: newName.trim() } });
      setShowRename(false);
      toast.success("List renamed");
    } catch {
      toast.error("Failed to rename list");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteList.mutateAsync(id);
      toast.success("List deleted");
      navigate("/lists", { replace: true });
    } catch {
      toast.error("Failed to delete list");
    }
  };

  const handleRemoveMovie = async (movieId: string) => {
    try {
      await removeMovie.mutateAsync({ listId: id, movieId });
      toast.success("Removed from list");
    } catch {
      toast.error("Failed to remove movie");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`skeleton-${i.toString()}`} className="space-y-2">
              <Skeleton className="aspect-2/3 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-semibold">List not found</h2>
        <Link to="/lists">
          <Button variant="link">Back to lists</Button>
        </Link>
      </div>
    );
  }

  const movies = list.movies ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">{list.name}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setNewName(list.name);
            setShowRename(true);
          }}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowDelete(true)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {movies.length} movie{movies.length !== 1 ? "s" : ""}
      </p>

      {movies.length === 0 ? (
        <EmptyState
          icon={<Film className="h-12 w-12" />}
          title="No movies in this list"
          description='Open a movie and use "Add to List" to add it here'
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <div key={movie.id} className="relative group">
              <MovieCard movie={movie} />
              <button
                className="absolute top-2 left-2 rounded-full bg-background/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => void handleRemoveMovie(movie.id)}
                title="Remove from list"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showRename} onOpenChange={setShowRename}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename List</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="List name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleRename();
            }}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRename(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleRename()}
              disabled={!newName.trim() || updateList.isPending}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete list"
        description={`Are you sure you want to delete "${list.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => void handleDelete()}
        loading={deleteList.isPending}
      />
    </div>
  );
}
