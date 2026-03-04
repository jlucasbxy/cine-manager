import type { RatingRepository } from "@/application/interfaces/repositories";
import type { Rating } from "@/domain/entities";
import { Rating as RatingEntity } from "@/domain/entities/rating.entity";
import type { Uuid } from "@/domain/value-objects";
import { RatingValue } from "@/domain/value-objects/rating-value.value-object";
import { Uuid as UuidVO } from "@/domain/value-objects/uuid.value-object";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";

export class PrismaRatingRepository implements RatingRepository {
  constructor(private readonly db: PrismaDatabase) {}

  async upsert(rating: Rating): Promise<Rating | null> {
    const now = new Date();
    try {
      const raw = await this.db.rating.upsert({
        where: {
          userId_movieId: {
            userId: rating.userId.toString(),
            movieId: rating.movieId.toString()
          }
        },
        update: {
          value: rating.value.toNumber(),
          updatedAt: now
        },
        create: {
          id: rating.id.toString(),
          userId: rating.userId.toString(),
          movieId: rating.movieId.toString(),
          value: rating.value.toNumber(),
          createdAt: rating.createdAt,
          updatedAt: rating.updatedAt
        }
      });

      return RatingEntity.reconstitute({
        id: UuidVO.reconstitute(raw.id),
        userId: UuidVO.reconstitute(raw.userId),
        movieId: UuidVO.reconstitute(raw.movieId),
        value: RatingValue.reconstitute(raw.value),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2003"
      ) {
        return null;
      }
      throw error;
    }
  }

  async getAverageAndCount(
    movieId: Uuid
  ): Promise<{ average: number; count: number }> {
    const result = await this.db.rating.aggregate({
      where: { movieId: movieId.toString() },
      _avg: { value: true },
      _count: { value: true }
    });

    return {
      average: result._avg.value ?? 0,
      count: result._count.value
    };
  }
}
