import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGenres } from "@/queries/use-genres";

interface GenreMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function GenreMultiSelect({ value, onChange }: GenreMultiSelectProps) {
  const { data: genres = [] } = useGenres();

  const handleAdd = (genreId: string) => {
    if (!value.includes(genreId)) {
      onChange([...value, genreId]);
    }
  };

  const handleRemove = (genreId: string) => {
    onChange(value.filter((id) => id !== genreId));
  };

  const availableGenres = genres.filter((g) => !value.includes(g.id));
  const selectedGenres = genres.filter((g) => value.includes(g.id));

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">Genres</span>

      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedGenres.map((genre) => (
            <Badge key={genre.id} variant="secondary" className="gap-1">
              {genre.name}
              <button
                type="button"
                onClick={() => handleRemove(genre.id)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {availableGenres.length > 0 && (
        <Select onValueChange={handleAdd} value="">
          <SelectTrigger>
            <SelectValue placeholder="Add genre..." />
          </SelectTrigger>
          <SelectContent>
            {availableGenres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
