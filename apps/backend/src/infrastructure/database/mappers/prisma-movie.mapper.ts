import { Movie } from "@/domain/entities";
import type { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import type { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import {
  AgeRating,
  Money,
  MovieStatus,
  NonNegativeDecimal,
  NonNegativeInt,
  Url,
  Uuid
} from "@/domain/value-objects";
import type { MovieModel } from "@/infrastructure/database/prisma/generated/prisma/models/Movie";

export class PrismaMovieMapper {
  static toDomain(raw: MovieModel): Movie {
    return Movie.reconstitute({
      id: Uuid.reconstitute(raw.id),
      title: raw.title,
      originalTitle: raw.originalTitle,
      tagline: raw.tagline,
      synopsis: raw.synopsis,
      releaseDate: raw.releaseDate,
      runtime: NonNegativeInt.reconstitute(raw.runtime),
      status: MovieStatus.reconstitute(raw.status as MovieStatusEnum),
      ageRating: AgeRating.reconstitute(raw.ageRating as AgeRatingEnum),
      languageId: Uuid.reconstitute(raw.languageId),
      budget: Money.reconstitute(Number(raw.budget)),
      revenue: Money.reconstitute(Number(raw.revenue)),
      posterUrl: Url.reconstitute(raw.posterUrl),
      backdropUrl: Url.reconstitute(raw.backdropUrl),
      trailerUrl: Url.reconstitute(raw.trailerUrl),
      votes: NonNegativeInt.reconstitute(raw.votes),
      score: NonNegativeDecimal.reconstitute(raw.score),
      isPublic: raw.isPublic,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      userId: Uuid.reconstitute(raw.userId)
    });
  }
}
