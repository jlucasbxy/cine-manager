import { Url } from "@/domain/value-objects/url.value-object";
import { InvalidUrlError } from "@/domain/errors";

describe("Url", () => {
  it("creates with valid URL", () => {
    const url = Url.create("https://example.com");
    expect(url.toString()).toBe("https://example.com");
  });

  it("throws InvalidUrlError for invalid URL", () => {
    expect(() => Url.create("not-a-url")).toThrow(InvalidUrlError);
  });

  it("throws for empty string", () => {
    expect(() => Url.create("")).toThrow(InvalidUrlError);
  });

  it("reconstitutes without validation", () => {
    const url = Url.reconstitute("anything");
    expect(url.toString()).toBe("anything");
  });
});
