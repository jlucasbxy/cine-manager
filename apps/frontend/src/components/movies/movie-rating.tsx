import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRateMovie } from "@/queries/use-movies";

interface MovieRatingProps {
  movieId: string;
  score: number;
  votes: number;
}

export function MovieRating({ movieId, score, votes }: MovieRatingProps) {
  const rateMovie = useRateMovie();
  const [hovered, setHovered] = useState<number | null>(null);

  const filled = hovered !== null ? hovered : Math.round(score);

  const handleRate = async (value: number) => {
    try {
      await rateMovie.mutateAsync({ id: movieId, value });
      toast.success(`You rated this movie ${value}/10`);
    } catch {
      toast.error("Failed to submit rating");
    }
  };

  return (
    <div className="space-y-1">
      <fieldset
        className="m-0 flex min-w-0 items-center gap-0.5 border-0 p-0"
        onMouseLeave={() => setHovered(null)}
      >
        <legend className="sr-only">Rate this movie</legend>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} out of 10`}
            disabled={rateMovie.isPending}
            onClick={() => void handleRate(star)}
            onMouseEnter={() => setHovered(star)}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors",
                star <= filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-muted-foreground"
              )}
            />
          </button>
        ))}
      </fieldset>
      <p className="text-sm text-muted-foreground">
        {score.toFixed(1)}/10 · {votes} votes
      </p>
    </div>
  );
}
