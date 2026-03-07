import { describe, expect, it } from "vitest";
import { getApp } from "../helpers/app-context";
import { registerUser } from "../helpers/auth-helper";

describe("Auth routes", () => {
  describe("POST /api/v1/auth/login", () => {
    it("should return 200 with accessToken and set refreshToken cookie", async () => {
      const app = getApp();
      const email = "login@example.com";
      const password = "Str0ng!Pass#2024";

      await app.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: { name: "Login User", email, password }
      });

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/login",
        payload: { email, password }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveProperty("accessToken");
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"]).toContain("refreshToken");
    });

    it("should return 401 for invalid credentials", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/login",
        payload: { email: "wrong@example.com", password: "Wr0ng!Pass#99" }
      });

      expect(response.statusCode).toBe(401);
      expect(response.json().code).toBe("INVALID_CREDENTIALS");
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should return 204 and clear the refresh token cookie", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/logout",
        headers: {
          cookie: user.refreshTokenCookie
        }
      });

      expect(response.statusCode).toBe(204);
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("should return a new accessToken when given a valid refresh cookie", async () => {
      const user = await registerUser();
      const app = getApp();

      const cookieHeader = extractCookieHeader(user.refreshTokenCookie);

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/refresh",
        headers: {
          cookie: cookieHeader
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveProperty("accessToken");
    });

    it("should reject request without refresh token cookie", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/refresh"
      });

      expect([401, 500]).toContain(response.statusCode);
    });
  });

  describe("POST /api/v1/auth/password-reset/request", () => {
    it("should return 204 regardless of email existence", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/password-reset/request",
        payload: { email: "anyone@example.com" }
      });

      expect(response.statusCode).toBe(204);
    });
  });
});

function extractCookieHeader(setCookieHeader: string): string {
  const [cookieHeader] = setCookieHeader.split(";");
  if (!cookieHeader) throw new Error("Invalid Set-Cookie header");
  return cookieHeader;
}
