import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2", "text-sm", "px-4")).toBe("text-sm px-4");
  });

  it("ignores falsy inputs", () => {
    expect(cn("font-bold", undefined, false && "hidden", null)).toBe(
      "font-bold"
    );
  });
});
