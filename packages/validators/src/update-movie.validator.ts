import z from "zod";
import { AgeRating, MovieStatus } from "./enums";
import type { Validator } from "./validator";
import type { UpdateMovieDTO } from "@repo/dtos";

const ageRatingValues = Object.values(AgeRating) as [string, ...string[]];
const movieStatusValues = Object.values(MovieStatus) as [string, ...string[]];

export class UpdateMovieValidator implements Validator<UpdateMovieDTO> {
  private readonly updateMovieSchema = z.object({
    title: z.string().min(1).optional(),
    originalTitle: z.string().min(1).optional(),
    tagline: z.string().min(1).optional(),
    synopsis: z.string().min(1).optional(),
    releaseDate: z.coerce.date().optional(),
    runtime: z.number().int().positive().optional(),
    status: z.enum(movieStatusValues).optional(),
    ageRating: z.enum(ageRatingValues).optional(),
    languageId: z.uuidv7().optional(),
    budget: z.number().nonnegative().optional(),
    revenue: z.number().nonnegative().optional(),
    posterUrl: z.url().optional(),
    backdropUrl: z.url().optional(),
    trailerUrl: z.url().optional(),
    genres: z.array(z.uuidv7()).optional()
  });

  parse(data: Record<string, unknown>) {
    return this.updateMovieSchema.parse(data);
  }
}
