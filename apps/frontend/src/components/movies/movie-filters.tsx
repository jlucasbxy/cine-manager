import { AgeRating, MovieStatus } from "@repo/dtos";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

export interface MovieFiltersState {
  runtime?: number;
  releaseDateStart?: string;
  releaseDateEnd?: string;
  status?: MovieStatus;
  ageRating?: AgeRating;
  onlyMine?: boolean;
}

interface MovieFiltersProps {
  filters: MovieFiltersState;
  onFiltersChange: (filters: MovieFiltersState) => void;
}

export function MovieFilters({ filters, onFiltersChange }: MovieFiltersProps) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<MovieFiltersState>(filters);

  useEffect(() => {
    if (open) setLocal(filters);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = () => {
    onFiltersChange(local);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared: MovieFiltersState = {};
    setLocal(cleared);
    onFiltersChange(cleared);
    setOpen(false);
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label>Max Runtime (minutes)</Label>
            <Input
              type="number"
              placeholder="e.g. 120"
              value={local.runtime ?? ""}
              onChange={(e) =>
                setLocal({
                  ...local,
                  runtime: e.target.value ? Number(e.target.value) : undefined
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Release Date From</Label>
            <Input
              type="date"
              value={local.releaseDateStart ?? ""}
              onChange={(e) =>
                setLocal({
                  ...local,
                  releaseDateStart: e.target.value || undefined
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Release Date To</Label>
            <Input
              type="date"
              value={local.releaseDateEnd ?? ""}
              onChange={(e) =>
                setLocal({
                  ...local,
                  releaseDateEnd: e.target.value || undefined
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={local.status ?? "all"}
              onValueChange={(v) =>
                setLocal({
                  ...local,
                  status: v === "all" ? undefined : (v as MovieStatus)
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.values(MovieStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Age Rating</Label>
            <Select
              value={local.ageRating ?? "all"}
              onValueChange={(v) =>
                setLocal({
                  ...local,
                  ageRating: v === "all" ? undefined : (v as AgeRating)
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ratings</SelectItem>
                {Object.values(AgeRating).map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="only-mine">My Movies only</Label>
            <Switch
              id="only-mine"
              checked={local.onlyMine ?? false}
              onCheckedChange={(checked) =>
                setLocal({ ...local, onlyMine: checked || undefined })
              }
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApply} className="flex-1">
              Apply
            </Button>
            <Button variant="outline" onClick={handleClear} className="flex-1">
              Clear
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
