import z from "zod";
import { AgeRating, MovieStatus } from "./enums";

const ageRatingValues = Object.values(AgeRating) as [string, ...string[]];
const movieStatusValues = Object.values(MovieStatus) as [string, ...string[]];

const createMovieSchema = z.object({
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

const updateMovieSchema = z.object({
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

export class CreateMovieDTO {
  readonly title: string;
  readonly originalTitle: string;
  readonly tagline: string;
  readonly synopsis: string;
  readonly releaseDate: Date;
  readonly runtime: number;
  readonly status: MovieStatus;
  readonly ageRating: AgeRating;
  readonly languageId: string;
  readonly budget: number;
  readonly revenue: number;
  readonly posterUrl: string;
  readonly backdropUrl: string;
  readonly trailerUrl: string;
  readonly userId: string;
  readonly genres?: string[];

  constructor(data: unknown) {
    const parsed = createMovieSchema.parse(data);
    this.title = parsed.title;
    this.originalTitle = parsed.originalTitle;
    this.tagline = parsed.tagline;
    this.synopsis = parsed.synopsis;
    this.releaseDate = parsed.releaseDate;
    this.runtime = parsed.runtime;
    this.status = parsed.status as MovieStatus;
    this.ageRating = parsed.ageRating as AgeRating;
    this.languageId = parsed.languageId;
    this.budget = parsed.budget;
    this.revenue = parsed.revenue;
    this.posterUrl = parsed.posterUrl;
    this.backdropUrl = parsed.backdropUrl;
    this.trailerUrl = parsed.trailerUrl;
    this.userId = parsed.userId;
    this.genres = parsed.genres;
  }
}

export class UpdateMovieDTO {
  readonly title?: string;
  readonly originalTitle?: string;
  readonly tagline?: string;
  readonly synopsis?: string;
  readonly releaseDate?: Date;
  readonly runtime?: number;
  readonly status?: MovieStatus;
  readonly ageRating?: AgeRating;
  readonly languageId?: string;
  readonly budget?: number;
  readonly revenue?: number;
  readonly posterUrl?: string;
  readonly backdropUrl?: string;
  readonly trailerUrl?: string;
  readonly genres?: string[];

  constructor(data: unknown) {
    const parsed = updateMovieSchema.parse(data);
    this.title = parsed.title;
    this.originalTitle = parsed.originalTitle;
    this.tagline = parsed.tagline;
    this.synopsis = parsed.synopsis;
    this.releaseDate = parsed.releaseDate;
    this.runtime = parsed.runtime;
    this.status = parsed.status as MovieStatus | undefined;
    this.ageRating = parsed.ageRating as AgeRating | undefined;
    this.languageId = parsed.languageId;
    this.budget = parsed.budget;
    this.revenue = parsed.revenue;
    this.posterUrl = parsed.posterUrl;
    this.backdropUrl = parsed.backdropUrl;
    this.trailerUrl = parsed.trailerUrl;
    this.genres = parsed.genres;
  }
}
