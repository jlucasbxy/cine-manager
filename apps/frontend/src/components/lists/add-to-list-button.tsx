import { BookmarkPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAddMovieToList, useLists } from "@/queries/use-movie-lists";

interface AddToListButtonProps {
  movieId: string;
}

export function AddToListButton({ movieId }: AddToListButtonProps) {
  const { data: lists = [] } = useLists();
  const addMovie = useAddMovieToList();

  const handleAdd = async (listId: string, listName: string) => {
    try {
      await addMovie.mutateAsync({ listId, movieId });
      toast.success(`Added to "${listName}"`);
    } catch {
      toast.error("Failed to add to list");
    }
  };

  if (lists.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookmarkPlus className="h-4 w-4" />
          Add to List
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {lists.map((list) => (
          <DropdownMenuItem
            key={list.id}
            className="cursor-pointer"
            onClick={() => void handleAdd(list.id, list.name)}
          >
            {list.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
