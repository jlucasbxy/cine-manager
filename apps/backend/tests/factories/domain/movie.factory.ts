import { Movie } from "@/domain/entities/movie.entity";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import {
  AgeRating,
  Money,
  MovieStatus,
  NonNegativeInt,
  NonNegativeNumber,
  Url,
  Uuid
} from "@/domain/value-objects";

type MovieOverrides = Partial<{
  id: Uuid;
  title: string;
  originalTitle: string;
  tagline: string;
  synopsis: string;
  releaseDate: Date;
  runtime: number;
  status: MovieStatusEnum;
  ageRating: AgeRatingEnum;
  languageId: Uuid;
  budget: number;
  revenue: number;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  votes: number;
  score: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  userId: Uuid;
}>;

export function makeMovie(overrides: MovieOverrides = {}): Movie {
  return Movie.reconstitute({
    id: overrides.id ?? Uuid.generate(),
    title: overrides.title ?? "Test Movie",
    originalTitle: overrides.originalTitle ?? "Test Movie",
    tagline: overrides.tagline ?? "Test tagline",
    synopsis: overrides.synopsis ?? "Test synopsis",
    releaseDate: overrides.releaseDate ?? new Date("2024-06-01T00:00:00.000Z"),
    runtime: NonNegativeInt.reconstitute(overrides.runtime ?? 120),
    status: MovieStatus.reconstitute(overrides.status ?? MovieStatusEnum.RELEASED),
    ageRating: AgeRating.reconstitute(overrides.ageRating ?? AgeRatingEnum.L),
    languageId: overrides.languageId ?? Uuid.generate(),
    budget: Money.reconstitute(overrides.budget ?? 1000000),
    revenue: Money.reconstitute(overrides.revenue ?? 5000000),
    posterUrl: Url.reconstitute(
      overrides.posterUrl ?? "https://example.com/poster.jpg"
    ),
    backdropUrl: Url.reconstitute(
      overrides.backdropUrl ?? "https://example.com/backdrop.jpg"
    ),
    trailerUrl: Url.reconstitute(
      overrides.trailerUrl ?? "https://example.com/trailer.mp4"
    ),
    votes: NonNegativeInt.reconstitute(overrides.votes ?? 0),
    score: NonNegativeNumber.reconstitute(overrides.score ?? 0),
    isPublic: overrides.isPublic ?? true,
    createdAt: overrides.createdAt ?? new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: overrides.updatedAt ?? new Date("2024-01-01T00:00:00.000Z"),
    deletedAt: overrides.deletedAt ?? null,
    userId: overrides.userId ?? Uuid.generate()
  });
}
