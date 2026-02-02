import z from "zod";
import { AgeRating, MovieStatus } from "../enums";

const ageRatingValues = Object.values(AgeRating) as [string, ...string[]];
const movieStatusValues = Object.values(MovieStatus) as [string, ...string[]];

export const createMovieSchema = z.object({
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

export const updateMovieSchema = z.object({
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
