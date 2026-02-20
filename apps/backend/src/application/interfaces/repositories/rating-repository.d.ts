import type { Rating } from "@/domain/entities";
import type { Uuid } from "@/domain/value-objects";

export interface RatingRepository {
  upsert(rating: Rating): Promise<Rating>;
  getAverageAndCount(movieId: Uuid): Promise<{ average: number; count: number }>;
}
