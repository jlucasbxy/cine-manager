import { describe, expect, it } from "vitest";
import { getApp } from "../helpers/app-context";

describe("GET /health", () => {
  it("should return 200 with status ok", async () => {
    const app = getApp();

    const response = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });
});
