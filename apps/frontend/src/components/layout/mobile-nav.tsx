import { Film, Plus } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            CineManager
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          <Link to="/movies" onClick={() => onOpenChange(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <Film className="mr-2 h-4 w-4" />
              Movies
            </Button>
          </Link>
          <Link to="/movies/new" onClick={() => onOpenChange(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
