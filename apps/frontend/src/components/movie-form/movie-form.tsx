import { zodResolver } from "@hookform/resolvers/zod";
import type { MovieDTO } from "@repo/dtos";
import { AgeRating, MovieStatus } from "@repo/dtos";
import { movieSchema } from "@repo/validators";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { GenreMultiSelect } from "@/components/movie-form/genre-multi-select";
import { ImageUploadField } from "@/components/movie-form/image-upload-field";
import { LanguageSelect } from "@/components/movie-form/language-select";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const formSchema = movieSchema.extend({
  genres: z.array(z.string()).optional(),
  releaseDate: z.coerce.date()
});

type MovieFormData = z.infer<typeof formSchema>;

interface MovieFormProps {
  defaultValues?: MovieDTO;
  onSubmit: (data: MovieFormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

function formatDateForInput(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export function MovieForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel
}: MovieFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          originalTitle: defaultValues.originalTitle,
          tagline: defaultValues.tagline,
          synopsis: defaultValues.synopsis,
          releaseDate: new Date(defaultValues.releaseDate),
          runtime: defaultValues.runtime,
          status: defaultValues.status,
          ageRating: defaultValues.ageRating,
          languageId: defaultValues.languageId,
          budget: defaultValues.budget,
          revenue: defaultValues.revenue,
          posterUrl: defaultValues.posterUrl,
          backdropUrl: defaultValues.backdropUrl,
          trailerUrl: defaultValues.trailerUrl,
          genres: [],
          isPublic: defaultValues.isPublic ?? true
        }
      : {
          title: "",
          originalTitle: "",
          tagline: "",
          synopsis: "",
          runtime: 0,
          budget: 0,
          revenue: 0,
          posterUrl: "",
          backdropUrl: "",
          trailerUrl: "",
          genres: [],
          isPublic: true
        }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="originalTitle">Original Title</Label>
          <Input id="originalTitle" {...register("originalTitle")} />
          {errors.originalTitle && (
            <p className="text-sm text-destructive">
              {errors.originalTitle.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" {...register("tagline")} />
        {errors.tagline && (
          <p className="text-sm text-destructive">{errors.tagline.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="synopsis">Synopsis</Label>
        <Textarea id="synopsis" rows={4} {...register("synopsis")} />
        {errors.synopsis && (
          <p className="text-sm text-destructive">{errors.synopsis.message}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="releaseDate">Release Date</Label>
          <Input
            id="releaseDate"
            type="date"
            defaultValue={
              defaultValues ? formatDateForInput(defaultValues.releaseDate) : ""
            }
            {...register("releaseDate")}
          />
          {errors.releaseDate && (
            <p className="text-sm text-destructive">
              {errors.releaseDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="runtime">Runtime (minutes)</Label>
          <Input
            id="runtime"
            type="number"
            {...register("runtime", { valueAsNumber: true })}
          />
          {errors.runtime && (
            <p className="text-sm text-destructive">{errors.runtime.message}</p>
          )}
        </div>

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MovieStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Controller
          control={control}
          name="ageRating"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>Age Rating</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AgeRating).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ageRating && (
                <p className="text-sm text-destructive">
                  {errors.ageRating.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="languageId"
          render={({ field }) => (
            <LanguageSelect value={field.value} onChange={field.onChange} />
          )}
        />

        <Controller
          control={control}
          name="genres"
          render={({ field }) => (
            <GenreMultiSelect
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget (USD)</Label>
          <Input
            id="budget"
            type="number"
            {...register("budget", { valueAsNumber: true })}
          />
          {errors.budget && (
            <p className="text-sm text-destructive">{errors.budget.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenue">Revenue (USD)</Label>
          <Input
            id="revenue"
            type="number"
            {...register("revenue", { valueAsNumber: true })}
          />
          {errors.revenue && (
            <p className="text-sm text-destructive">{errors.revenue.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trailerUrl">Trailer URL</Label>
        <Input
          id="trailerUrl"
          type="url"
          placeholder="https://..."
          {...register("trailerUrl")}
        />
        {errors.trailerUrl && (
          <p className="text-sm text-destructive">
            {errors.trailerUrl.message}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="posterUrl"
          render={({ field }) => (
            <div>
              <ImageUploadField
                value={field.value}
                onChange={field.onChange}
                label="Poster"
                aspectRatio="aspect-[2/3]"
              />
              {errors.posterUrl && (
                <p className="text-sm text-destructive">
                  {errors.posterUrl.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="backdropUrl"
          render={({ field }) => (
            <div>
              <ImageUploadField
                value={field.value}
                onChange={field.onChange}
                label="Backdrop"
                aspectRatio="aspect-video"
              />
              {errors.backdropUrl && (
                <p className="text-sm text-destructive">
                  {errors.backdropUrl.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <Controller
        control={control}
        name="isPublic"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="isPublic"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="isPublic">Public</Label>
          </div>
        )}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
