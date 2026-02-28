import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MoviePaginationProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function MoviePagination({
  hasNextPage,
  hasPrevPage,
  onNext,
  onPrev
}: MoviePaginationProps) {
  if (!hasNextPage && !hasPrevPage) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" onClick={onPrev} disabled={!hasPrevPage}>
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button variant="outline" onClick={onNext} disabled={!hasNextPage}>
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
