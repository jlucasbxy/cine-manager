import type { MovieModel } from "@/infrastructure/database/prisma/generated/prisma/models/Movie";
import { Movie } from "@/domain/entities";
import {
  AgeRating,
  MovieStatus,
  NonNegativeInt,
  NonNegativeNumber,
  Url,
  Uuid
} from "@/domain/value-objects";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";

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
