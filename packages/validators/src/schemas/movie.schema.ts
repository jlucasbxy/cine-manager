import z from "zod";
import { AgeRating, MovieStatus } from "../enums";

const ageRatingValues = Object.values(AgeRating) as [string, ...string[]];
const movieStatusValues = Object.values(MovieStatus) as [string, ...string[]];

export const movieSchema = z.object({
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
  trailerUrl: z.url()
});
