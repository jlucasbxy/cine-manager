import { Uuid } from "@/domain/value-objects/uuid.value-object";
import { InvalidUuidError } from "@/domain/errors";

describe("Uuid", () => {
  it("creates with valid UUIDv7", () => {
    const generated = Uuid.generate();
    const uuid = Uuid.create(generated.toString());
    expect(uuid.toString()).toBe(generated.toString());
  });

  it("throws InvalidUuidError for invalid UUID", () => {
    expect(() => Uuid.create("not-a-uuid")).toThrow(InvalidUuidError);
  });

  it("throws for empty string", () => {
    expect(() => Uuid.create("")).toThrow(InvalidUuidError);
  });

  it("generates a valid UUID", () => {
    const uuid = Uuid.generate();
    expect(uuid.toString()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it("reconstitutes without validation", () => {
    const uuid = Uuid.reconstitute("anything");
    expect(uuid.toString()).toBe("anything");
  });
});
