import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import { Uuid } from "@/domain/value-objects";

type MovieInputOverrides = Partial<{
  title: string;
  originalTitle: string;
  tagline: string;
  synopsis: string;
  releaseDate: Date;
  runtime: number;
  status: MovieStatusEnum;
  ageRating: AgeRatingEnum;
  languageId: string;
  budget: number;
  revenue: number;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
}>;

export function makeMovieInput(overrides: MovieInputOverrides = {}) {
  return {
    title: overrides.title ?? "Test Movie",
    originalTitle: overrides.originalTitle ?? "Test Movie",
    tagline: overrides.tagline ?? "Tagline",
    synopsis: overrides.synopsis ?? "Synopsis",
    releaseDate: overrides.releaseDate ?? new Date("2020-06-01T00:00:00.000Z"),
    runtime: overrides.runtime ?? 120,
    status: overrides.status ?? MovieStatusEnum.RELEASED,
    ageRating: overrides.ageRating ?? AgeRatingEnum.L,
    languageId: overrides.languageId ?? Uuid.generate().toString(),
    budget: overrides.budget ?? 1000000,
    revenue: overrides.revenue ?? 5000000,
    posterUrl: overrides.posterUrl ?? "https://example.com/poster.jpg",
    backdropUrl: overrides.backdropUrl ?? "https://example.com/backdrop.jpg",
    trailerUrl: overrides.trailerUrl ?? "https://example.com/trailer.mp4"
  };
}
