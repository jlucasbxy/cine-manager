import z from "zod";
import { ageRatingSchema } from "./age-rating.schema";
import { idZodSchema } from "./id.schema";
import { movieStatusSchema } from "./movie-status.schema";

export const movieSchema = z.object({
  title: z.string().min(1),
  originalTitle: z.string().min(1),
  tagline: z.string().min(1),
  synopsis: z.string().min(1),
  releaseDate: z.coerce.date(),
  runtime: z.number().int().positive(),
  status: movieStatusSchema,
  ageRating: ageRatingSchema,
  languageId: idZodSchema,
  budget: z.number().nonnegative(),
  revenue: z.number().nonnegative(),
  posterUrl: z.url(),
  backdropUrl: z.url(),
  trailerUrl: z.url(),
  isPublic: z.boolean().optional().default(true)
});
