import z from "zod";
import { AgeRating, MovieStatus } from "./enums";
import type { Validator } from "./validator";
import type { CreateMovieDTO } from "@repo/dtos";

const ageRatingValues = Object.values(AgeRating) as [string, ...string[]];
const movieStatusValues = Object.values(MovieStatus) as [string, ...string[]];

export class CreateMovieValidator implements Validator<CreateMovieDTO> {
  private readonly createMovieSchema = z.object({
    title: z.string().min(1),
    originalTitle: z.string().min(1),
    tagline: z.string().min(1),
    synopsis: z.string().min(1),
    releaseDate: z.coerce.date(),
    runtime: z.number().int().positive(),
    status: z.enum(movieStatusValues),
    ageRating: z.enum(ageRatingValues),
    languageId: z.uuidv7(),
    budget: z.number().nonnegative(),
    revenue: z.number().nonnegative(),
    posterUrl: z.url(),
    backdropUrl: z.url(),
    trailerUrl: z.url(),
    userId: z.string().min(1),
    genres: z.array(z.uuidv7()).optional()
  });

  parse(data: Record<string, unknown>) {
    return this.createMovieSchema.parse(data);
  }
}
