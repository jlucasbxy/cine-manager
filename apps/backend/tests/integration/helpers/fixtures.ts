import { uuidv7 } from "uuidv7";
import type { PrismaClient } from "@/infrastructure/database/prisma/generated/prisma/client";

type UserFixtureOverrides = Partial<{
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;

type LanguageFixtureOverrides = Partial<{
  id: string;
  code: string;
  name: string;
}>;

type GenreFixtureOverrides = Partial<{
  id: string;
  name: string;
}>;

type MovieFixtureOverrides = Partial<{
  id: string;
  title: string;
  originalTitle: string;
  tagline: string;
  synopsis: string;
  releaseDate: Date;
  runtime: number;
  status:
    | "RELEASED"
    | "POST_PRODUCTION"
    | "IN_PRODUCTION"
    | "PLANNED"
    | "CANCELED"
    | "RUMORED";
  ageRating: "L" | "TEN" | "TWELVE" | "FOURTEEN" | "SIXTEEN" | "EIGHTEEN";
  languageId: string;
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
  userId: string;
  genreIds: string[];
}>;

type MovieListFixtureOverrides = Partial<{
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}>;

const baseDate = new Date("2024-01-01T00:00:00.000Z");

export const insertUser = async (
  prisma: PrismaClient,
  overrides: UserFixtureOverrides = {}
) => {
  return prisma.user.create({
    data: {
      id: overrides.id ?? uuidv7(),
      name: overrides.name ?? "Integration User",
      email: overrides.email ?? `user-${uuidv7()}@example.com`,
      password: overrides.password ?? "hashed-password",
      avatarUrl: overrides.avatarUrl ?? null,
      createdAt: overrides.createdAt ?? baseDate,
      updatedAt: overrides.updatedAt ?? baseDate
    }
  });
};

export const insertLanguage = async (
  prisma: PrismaClient,
  overrides: LanguageFixtureOverrides = {}
) => {
  return prisma.language.create({
    data: {
      id: overrides.id ?? uuidv7(),
      code: overrides.code ?? `l${uuidv7().slice(0, 7)}`,
      name: overrides.name ?? `Language ${uuidv7()}`
    }
  });
};

export const insertGenre = async (
  prisma: PrismaClient,
  overrides: GenreFixtureOverrides = {}
) => {
  return prisma.genre.create({
    data: {
      id: overrides.id ?? uuidv7(),
      name: overrides.name ?? `Genre ${uuidv7()}`
    }
  });
};

export const insertMovie = async (
  prisma: PrismaClient,
  overrides: MovieFixtureOverrides = {}
) => {
  if (!overrides.languageId) {
    throw new Error("insertMovie requires languageId");
  }
  if (!overrides.userId) {
    throw new Error("insertMovie requires userId");
  }

  return prisma.movie.create({
    data: {
      id: overrides.id ?? uuidv7(),
      title: overrides.title ?? "Integration Movie",
      originalTitle: overrides.originalTitle ?? "Integration Movie Original",
      tagline: overrides.tagline ?? "Integration tagline",
      synopsis: overrides.synopsis ?? "Integration synopsis",
      releaseDate:
        overrides.releaseDate ?? new Date("2024-06-01T00:00:00.000Z"),
      runtime: overrides.runtime ?? 120,
      status: overrides.status ?? "RELEASED",
      ageRating: overrides.ageRating ?? "L",
      languageId: overrides.languageId,
      budget: overrides.budget ?? 1_000_000,
      revenue: overrides.revenue ?? 5_000_000,
      posterUrl: overrides.posterUrl ?? "https://example.com/poster.jpg",
      backdropUrl: overrides.backdropUrl ?? "https://example.com/backdrop.jpg",
      trailerUrl: overrides.trailerUrl ?? "https://example.com/trailer.mp4",
      votes: overrides.votes ?? 0,
      score: overrides.score ?? 0,
      isPublic: overrides.isPublic ?? true,
      createdAt: overrides.createdAt ?? baseDate,
      updatedAt: overrides.updatedAt ?? baseDate,
      deletedAt: overrides.deletedAt ?? null,
      userId: overrides.userId,
      genres:
        overrides.genreIds && overrides.genreIds.length > 0
          ? { connect: overrides.genreIds.map((id) => ({ id })) }
          : undefined
    }
  });
};

export const insertMovieList = async (
  prisma: PrismaClient,
  overrides: MovieListFixtureOverrides = {}
) => {
  if (!overrides.userId) {
    throw new Error("insertMovieList requires userId");
  }

  return prisma.movieList.create({
    data: {
      id: overrides.id ?? uuidv7(),
      name: overrides.name ?? "Integration List",
      userId: overrides.userId,
      createdAt: overrides.createdAt ?? baseDate,
      updatedAt: overrides.updatedAt ?? baseDate
    }
  });
};
