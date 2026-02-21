import type { MovieListDTO } from "@repo/dtos";
import { List } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";

interface ListCardProps {
  list: MovieListDTO;
}

export function ListCard({ list }: ListCardProps) {
  return (
    <Link to={`/lists/${list.id}`}>
      <Card className="group transition-all hover:shadow-md hover:scale-[1.02]">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <List className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{list.name}</h3>
            <p className="text-xs text-muted-foreground">
              {list.movies ? `${list.movies.length} movie${list.movies.length !== 1 ? "s" : ""}` : ""}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
