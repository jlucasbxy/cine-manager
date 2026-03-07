import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import { InvalidMovieStatusError } from "@/domain/errors";
import { MovieStatus } from "@/domain/value-objects/movie-status.value-object";

describe("MovieStatus", () => {
  it("creates with valid status", () => {
    const status = MovieStatus.create(MovieStatusEnum.RELEASED);
    expect(status.getValue()).toBe(MovieStatusEnum.RELEASED);
    expect(status.toString()).toBe("RELEASED");
  });

  it("creates with each valid value", () => {
    for (const value of Object.values(MovieStatusEnum)) {
      const status = MovieStatus.create(value);
      expect(status.getValue()).toBe(value);
    }
  });

  it("throws InvalidMovieStatusError for invalid value", () => {
    expect(() => MovieStatus.create("INVALID")).toThrow(
      InvalidMovieStatusError
    );
  });

  it("reconstitutes without validation", () => {
    const status = MovieStatus.reconstitute(MovieStatusEnum.CANCELED);
    expect(status.getValue()).toBe(MovieStatusEnum.CANCELED);
  });
});
