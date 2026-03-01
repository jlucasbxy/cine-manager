import { MovieList } from "@/domain/entities/movie-list.entity";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

describe("MovieList", () => {
  describe("create", () => {
    it("generates UUID and timestamps", () => {
      const userId = Uuid.generate();
      const list = MovieList.create({ name: "Favorites", userId });

      expect(list.id.toString()).toBeTruthy();
      expect(list.name).toBe("Favorites");
      expect(list.userId).toBe(userId);
      expect(list.createdAt).toBeInstanceOf(Date);
      expect(list.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("reconstitute", () => {
    it("preserves all given props", () => {
      const id = Uuid.generate();
      const userId = Uuid.generate();
      const now = new Date();
      const list = MovieList.reconstitute({
        id,
        name: "Watchlist",
        userId,
        createdAt: now,
        updatedAt: now
      });

      expect(list.id).toBe(id);
      expect(list.name).toBe("Watchlist");
      expect(list.userId).toBe(userId);
      expect(list.createdAt).toBe(now);
    });
  });
});
