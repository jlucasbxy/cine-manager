import type { MovieDTO } from "@repo/dtos";
import type { Movie } from "@/domain/entities";

export class MovieMapper {
  static toDTO(movie: Movie): MovieDTO {
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
      createdAt: movie.createdAt.toISOString(),
      updatedAt: movie.updatedAt.toISOString(),
      userId: movie.userId.toString(),
    };
  }
}
