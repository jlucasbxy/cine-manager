import { describe, expect, it } from "vitest";
import { getApp } from "../helpers/app-context";
import { authHeaders, registerUser } from "../helpers/auth-helper";
import { getE2ePrismaClient } from "../helpers/e2e-context";
import { insertLanguage } from "../helpers/fixtures";

describe("Languages routes", () => {
  describe("GET /api/v1/languages", () => {
    it("should return 200 with a list of languages", async () => {
      const prisma = getE2ePrismaClient();
      await insertLanguage(prisma, { code: "en", name: "English" });
      await insertLanguage(prisma, { code: "pt", name: "Portuguese" });

      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/languages",
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(2);
    });

    it("should return 200 with empty array when no languages exist", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/languages",
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual([]);
    });

    it("should return 401 without auth token", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/languages"
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
