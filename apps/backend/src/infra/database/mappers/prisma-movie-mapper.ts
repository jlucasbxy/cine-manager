import type { MovieModel } from "../prisma/generated/prisma/models/Movie";
import { Movie } from "@/domain/entities";
import { AgeRating } from "@/domain/enums/age-rating.enum";
import { MovieStatus } from "@/domain/enums/movie-status.enum";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

export class PrismaMovieMapper {
  static toDomain(raw: MovieModel): Movie {
    return Movie.reconstitute({
      id: raw.id,
      title: raw.title,
      originalTitle: raw.originalTitle,
      tagline: raw.tagline,
      synopsis: raw.synopsis,
      releaseDate: raw.releaseDate,
      runtime: raw.runtime,
      status: raw.status as MovieStatus,
      ageRating: raw.ageRating as AgeRating,
      languageId: Uuid.reconstitute(raw.languageId),
      budget: raw.budget,
      revenue: raw.revenue,
      posterUrl: raw.posterUrl,
      backdropUrl: raw.backdropUrl,
      trailerUrl: raw.trailerUrl,
      votes: raw.votes,
      score: raw.score,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      userId: Uuid.reconstitute(raw.userId)
    });
  }
}
