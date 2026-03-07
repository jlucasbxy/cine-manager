import { describe, expect, it } from "vitest";
import { getApp } from "../helpers/app-context";
import { authHeaders, registerUser } from "../helpers/auth-helper";
import { getE2ePrismaClient } from "../helpers/e2e-context";
import { insertLanguage } from "../helpers/fixtures";

const makeMoviePayload = (languageId: string) => ({
  title: "List Movie",
  originalTitle: "List Movie Original",
  tagline: "A tagline",
  synopsis: "A synopsis",
  releaseDate: "2024-06-01",
  runtime: 120,
  status: "RELEASED",
  ageRating: "L",
  languageId,
  budget: 1_000_000,
  revenue: 5_000_000,
  posterUrl: "https://example.com/poster.jpg",
  backdropUrl: "https://example.com/backdrop.jpg",
  trailerUrl: "https://example.com/trailer.mp4",
  isPublic: true
});

describe("Movie Lists routes", () => {
  describe("POST /api/v1/lists", () => {
    it("should create a movie list and return 201", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/lists",
        headers: authHeaders(user.accessToken),
        payload: { name: "My Favorites" }
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body).toHaveProperty("id");
      expect(body.name).toBe("My Favorites");
    });

    it("should return 401 without auth token", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/lists",
        payload: { name: "My List" }
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /api/v1/lists", () => {
    it("should return 200 with user lists", async () => {
      const user = await registerUser();
      const app = getApp();

      await app.inject({
        method: "POST",
        url: "/api/v1/lists",
        headers: authHeaders(user.accessToken),
        payload: { name: "List 1" }
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/lists",
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(1);
    });

    it("should return 401 without auth token", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/lists"
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /api/v1/lists/:id", () => {
    it("should return 200 with the list", async () => {
      const user = await registerUser();
      const app = getApp();

      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/lists",
        headers: authHeaders(user.accessToken),
        payload: { name: "Detail List" }
      });
      const listId = createRes.json().id;

      const response = await app.inject({
        method: "GET",
        url: `/api/v1/lists/${listId}`,
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().id).toBe(listId);
    });

    it("should return error for non-existent list", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/lists/01935f6a-7c2d-7000-8000-000000000000",
        headers: authHeaders(user.accessToken)
      });

      expect([403, 404]).toContain(response.statusCode);
    });
  });

  describe("PUT /api/v1/lists/:id", () => {
    it("should update a list and return 200", async () => {
      const user = await registerUser();
      const app = getApp();

      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/lists",
        headers: authHeaders(user.accessToken),
        payload: { name: "Old Name" }
      });
      const listId = createRes.json().id;

      const response = await app.inject({
        method: "PUT",
        url: `/api/v1/lists/${listId}`,
        headers: authHeaders(user.accessToken),
        payload: { name: "New Name" }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().name).toBe("New Name");
    });
  });

  describe("DELETE /api/v1/lists/:id", () => {
    it("should delete a list and return 204", async () => {
      const user = await registerUser();
      const app = getApp();

      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/lists",
        headers: authHeaders(user.accessToken),
        payload: { name: "To Delete" }
      });
      const listId = createRes.json().id;

      const response = await app.inject({
        method: "DELETE",
        url: `/api/v1/lists/${listId}`,
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(204);
    });
  });

  describe("POST /api/v1/lists/:id/movies", () => {
    it("should add a movie to a list and return 200", async () => {
      const prisma = getE2ePrismaClient();
      const language = await insertLanguage(prisma);
      const user = await registerUser();
      const app = getApp();

      const movieRes = await app.inject({
        method: "POST",
        url: "/api/v1/movies",
        headers: authHeaders(user.accessToken),
        payload: makeMoviePayload(language.id)
      });
      const movieId = movieRes.json().id;

      const listRes = await app.inject({
        method: "POST",
        url: "/api/v1/lists",
        headers: authHeaders(user.accessToken),
        payload: { name: "Watch Later" }
      });
      const listId = listRes.json().id;

      const response = await app.inject({
        method: "POST",
        url: `/api/v1/lists/${listId}/movies`,
        headers: authHeaders(user.accessToken),
        payload: { movieId }
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /api/v1/lists/:id/movies/:movieId", () => {
    it("should remove a movie from a list and return 204", async () => {
      const prisma = getE2ePrismaClient();
      const language = await insertLanguage(prisma);
      const user = await registerUser();
      const app = getApp();

      const movieRes = await app.inject({
        method: "POST",
        url: "/api/v1/movies",
        headers: authHeaders(user.accessToken),
        payload: makeMoviePayload(language.id)
      });
      const movieId = movieRes.json().id;

      const listRes = await app.inject({
        method: "POST",
        url: "/api/v1/lists",
        headers: authHeaders(user.accessToken),
        payload: { name: "Remove Test" }
      });
      const listId = listRes.json().id;

      await app.inject({
        method: "POST",
        url: `/api/v1/lists/${listId}/movies`,
        headers: authHeaders(user.accessToken),
        payload: { movieId }
      });

      const response = await app.inject({
        method: "DELETE",
        url: `/api/v1/lists/${listId}/movies/${movieId}`,
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(204);
    });
  });
});
