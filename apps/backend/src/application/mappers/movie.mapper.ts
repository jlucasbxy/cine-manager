import type { MovieDTO } from "@repo/dtos";
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

type MovieUserInfo = { id: string; name: string; avatarUrl: string | null };

export class MovieMapper {
  static toDTO(movie: Movie, user?: MovieUserInfo): MovieDTO {
    return {
      id: movie.id.toString(),
      title: movie.title,
      originalTitle: movie.originalTitle,
      tagline: movie.tagline,
      synopsis: movie.synopsis,
      releaseDate: movie.releaseDate.toISOString(),
      runtime: movie.runtime.toNumber(),
      status: movie.status.toString(),
      ageRating: movie.ageRating.toString(),
      languageId: movie.languageId.toString(),
      budget: movie.budget.toNumber(),
      revenue: movie.revenue.toNumber(),
      posterUrl: movie.posterUrl.toString(),
      backdropUrl: movie.backdropUrl.toString(),
      trailerUrl: movie.trailerUrl.toString(),
      votes: movie.votes.toNumber(),
      score: movie.score.toNumber(),
      isPublic: movie.isPublic,
      createdAt: movie.createdAt.toISOString(),
      updatedAt: movie.updatedAt.toISOString(),
      deletedAt: movie.deletedAt?.toISOString() ?? null,
      userId: movie.userId.toString(),
      user
    };
  }

  static fromDto(data: MovieDTO) {
    return Movie.reconstitute({
      id: Uuid.reconstitute(data.id),
      title: data.title,
      originalTitle: data.originalTitle,
      tagline: data.tagline,
      synopsis: data.synopsis,
      releaseDate: new Date(data.releaseDate),
      runtime: NonNegativeInt.reconstitute(data.runtime),
      status: MovieStatus.reconstitute(data.status as MovieStatusEnum),
      ageRating: AgeRating.reconstitute(data.ageRating as AgeRatingEnum),
      languageId: Uuid.reconstitute(data.languageId),
      budget: Money.reconstitute(data.budget),
      revenue: Money.reconstitute(data.revenue),
      posterUrl: Url.reconstitute(data.posterUrl),
      backdropUrl: Url.reconstitute(data.backdropUrl),
      trailerUrl: Url.reconstitute(data.trailerUrl),
      votes: NonNegativeInt.reconstitute(data.votes),
      score: NonNegativeDecimal.reconstitute(data.score),
      isPublic: data.isPublic,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      deletedAt: data.deletedAt ? new Date(data.deletedAt) : null,
      userId: Uuid.reconstitute(data.userId)
    });
  }
}
