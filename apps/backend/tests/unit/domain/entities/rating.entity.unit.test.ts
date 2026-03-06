import { Rating } from "@/domain/entities/rating.entity";
import { RatingValue } from "@/domain/value-objects/rating-value.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

describe("Rating", () => {
  describe("create", () => {
    it("generates UUID and timestamps", () => {
      const userId = Uuid.generate();
      const movieId = Uuid.generate();
      const value = RatingValue.create(8);
      const rating = Rating.create({ userId, movieId, value });

      expect(rating.id.toString()).toBeTruthy();
      expect(rating.userId).toBe(userId);
      expect(rating.movieId).toBe(movieId);
      expect(rating.value.toNumber()).toBe(8);
      expect(rating.createdAt).toBeInstanceOf(Date);
      expect(rating.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("reconstitute", () => {
    it("preserves all given props", () => {
      const props = {
        id: Uuid.generate(),
        userId: Uuid.generate(),
        movieId: Uuid.generate(),
        value: RatingValue.create(5),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-06-01")
      };
      const rating = Rating.reconstitute(props);

      expect(rating.id).toBe(props.id);
      expect(rating.value.toNumber()).toBe(5);
      expect(rating.createdAt).toBe(props.createdAt);
      expect(rating.updatedAt).toBe(props.updatedAt);
    });
  });
});
