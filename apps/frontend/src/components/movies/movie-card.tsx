import type { MovieDTO } from "@repo/dtos";
import { Lock, Star } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MovieCardProps {
  movie: MovieDTO;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movies/${movie.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="relative aspect-2/3 overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {movie.isPublic === false && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="gap-1">
              <Star className="h-3 w-3 fill-current" />
              {movie.score.toFixed(1)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="line-clamp-1 font-semibold text-sm">{movie.title}</h3>
          <p className="text-xs text-muted-foreground">
            {new Date(movie.releaseDate).getFullYear()} &middot; {movie.runtime}{" "}
            min
          </p>
          <div className="mt-1 flex gap-1">
            <Badge variant="outline" className="text-xs">
              {movie.ageRating}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
