import { InvalidMovieQueryError } from "@/domain/errors";
import { MovieQuery } from "@/domain/value-objects/movie-query.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

describe("MovieQuery", () => {
  const currentUserId = Uuid.generate().toString();

  it("creates with minimal required fields", () => {
    const query = MovieQuery.create({ limit: 10, currentUserId });
    expect(query.limit.toNumber()).toBe(10);
    expect(query.currentUserId.toString()).toBe(currentUserId);
  });

  it("creates with all optional fields", () => {
    const userId = Uuid.generate().toString();
    const query = MovieQuery.create({
      limit: 20,
      currentUserId,
      runtime: 120,
      releaseDateStart: "2024-01-01",
      releaseDateEnd: "2024-12-31",
      status: "RELEASED",
      ageRating: "L",
      search: "test",
      userId,
      genreIds: ["1", "2"]
    });
    expect(query.runtime?.toNumber()).toBe(120);
    expect(query.status).toBe("RELEASED");
    expect(query.ageRating).toBe("L");
    expect(query.search).toBe("test");
    expect(query.genreIds).toEqual(["1", "2"]);
  });

  it("throws when limit is negative", () => {
    expect(() => MovieQuery.create({ limit: -1, currentUserId })).toThrow(
      InvalidMovieQueryError
    );
  });

  it("throws when releaseDateStart > releaseDateEnd", () => {
    expect(() =>
      MovieQuery.create({
        limit: 10,
        currentUserId,
        releaseDateStart: "2024-12-31",
        releaseDateEnd: "2024-01-01"
      })
    ).toThrow(InvalidMovieQueryError);
  });

  it("throws for invalid currentUserId", () => {
    expect(() =>
      MovieQuery.create({ limit: 10, currentUserId: "bad" })
    ).toThrow(InvalidMovieQueryError);
  });
});
