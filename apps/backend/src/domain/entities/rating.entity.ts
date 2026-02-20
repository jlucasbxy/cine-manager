import { RatingValue } from "@/domain/value-objects/rating-value.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

interface CreateRatingProps {
  userId: Uuid;
  movieId: Uuid;
  value: RatingValue;
}

interface ReconstituteRatingProps extends CreateRatingProps {
  id: Uuid;
  createdAt: Date;
  updatedAt: Date;
}

export class Rating {
  readonly id: Uuid;
  readonly userId: Uuid;
  readonly movieId: Uuid;
  readonly value: RatingValue;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(data: ReconstituteRatingProps) {
    this.id = data.id;
    this.userId = data.userId;
    this.movieId = data.movieId;
    this.value = data.value;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(props: CreateRatingProps): Rating {
    const now = new Date();
    return new Rating({
      id: Uuid.generate(),
      userId: props.userId,
      movieId: props.movieId,
      value: props.value,
      createdAt: now,
      updatedAt: now
    });
  }

  static reconstitute(props: ReconstituteRatingProps): Rating {
    return new Rating(props);
  }
}
