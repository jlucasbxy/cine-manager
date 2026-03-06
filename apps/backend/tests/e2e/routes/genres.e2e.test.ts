import { describe, it, expect } from "vitest";
import { getApp } from "../helpers/app-context";
import { authHeaders, registerUser } from "../helpers/auth-helper";
import { getE2ePrismaClient } from "../helpers/e2e-context";
import { insertGenre } from "../helpers/fixtures";

describe("Genres routes", () => {
  describe("GET /api/v1/genres", () => {
    it("should return 200 with a list of genres", async () => {
      const prisma = getE2ePrismaClient();
      await insertGenre(prisma, { name: "Action" });
      await insertGenre(prisma, { name: "Comedy" });

      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/genres",
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(2);
    });

    it("should return 200 with empty array when no genres exist", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/genres",
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual([]);
    });

    it("should return 401 without auth token", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/genres"
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
