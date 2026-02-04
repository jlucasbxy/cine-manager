import type { MovieModel } from "@/infra/database/prisma/generated/prisma/models/Movie";
import { Movie } from "@/domain/entities";
import { AgeRating } from "@/domain/enums/age-rating.enum";
import { MovieStatus } from "@/domain/enums/movie-status.enum";
import { NonNegativeInt } from "@/domain/value-objects/non-negative-int.value-object";
import { NonNegativeNumber } from "@/domain/value-objects/non-negative-number.value-object";
import { Url } from "@/domain/value-objects/url.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

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
      status: raw.status as MovieStatus,
      ageRating: raw.ageRating as AgeRating,
      languageId: Uuid.reconstitute(raw.languageId),
      budget: NonNegativeNumber.reconstitute(raw.budget),
      revenue: NonNegativeNumber.reconstitute(raw.revenue),
      posterUrl: Url.reconstitute(raw.posterUrl),
      backdropUrl: Url.reconstitute(raw.backdropUrl),
      trailerUrl: Url.reconstitute(raw.trailerUrl),
      votes: NonNegativeInt.reconstitute(raw.votes),
      score: NonNegativeNumber.reconstitute(raw.score),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      userId: Uuid.reconstitute(raw.userId)
    });
  }
}
