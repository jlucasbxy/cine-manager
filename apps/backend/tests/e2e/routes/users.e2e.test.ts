import { describe, expect, it } from "vitest";
import { getApp } from "../helpers/app-context";
import { authHeaders, registerUser } from "../helpers/auth-helper";

describe("Users routes", () => {
  describe("POST /api/v1/users", () => {
    it("should create a user and return 201", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: {
          name: "Test User",
          email: "test@example.com",
          password: "Str0ng!Pass#2024"
        }
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body).toHaveProperty("id");
      expect(body.name).toBe("Test User");
      expect(body.email).toBe("test@example.com");
      expect(body).not.toHaveProperty("password");
    });

    it("should return 409 for duplicate email", async () => {
      const app = getApp();
      const email = "duplicate@example.com";

      await app.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: { name: "User 1", email, password: "Str0ng!Pass#2024" }
      });

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: { name: "User 2", email, password: "An0ther!Str0ng#99" }
      });

      expect(response.statusCode).toBe(409);
      expect(response.json().code).toBe("EMAIL_ALREADY_IN_USE");
    });

    it("should return 400 for missing required fields", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: { name: "No Email" }
      });

      expect(response.statusCode).toBe(400);
    });

    it("should return 400 for invalid password (too short)", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: {
          name: "User",
          email: "user@example.com",
          password: "short"
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /api/v1/users/me", () => {
    it("should return the authenticated user profile", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/users/me",
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.id).toBe(user.id);
      expect(body.email).toBe(user.email);
      expect(body).not.toHaveProperty("password");
    });

    it("should return 401 without auth token", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/users/me"
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("PATCH /api/v1/users", () => {
    it("should update the user name", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "PATCH",
        url: "/api/v1/users",
        headers: authHeaders(user.accessToken),
        payload: { name: "Updated Name" }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().name).toBe("Updated Name");
    });

    it("should return 401 without auth token", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "PATCH",
        url: "/api/v1/users",
        payload: { name: "Updated" }
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
