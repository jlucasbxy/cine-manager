import { describe, it, expect } from "vitest";
import { getApp } from "../helpers/app-context";
import { authHeaders, registerUser } from "../helpers/auth-helper";
import { getE2ePrismaClient } from "../helpers/e2e-context";
import { insertGenre, insertLanguage } from "../helpers/fixtures";

const makeMoviePayload = (languageId: string, genreIds?: string[]) => ({
  title: "Test Movie",
  originalTitle: "Test Movie Original",
  tagline: "A test tagline",
  synopsis: "A test synopsis for the movie",
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
  isPublic: true,
  ...(genreIds ? { genres: genreIds } : {})
});

describe("Movies routes", () => {
  describe("POST /api/v1/movies", () => {
    it("should create a movie and return 201", async () => {
      const prisma = getE2ePrismaClient();
      const language = await insertLanguage(prisma);
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/movies",
        headers: authHeaders(user.accessToken),
        payload: makeMoviePayload(language.id)
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body).toHaveProperty("id");
      expect(body.title).toBe("Test Movie");
      expect(body.languageId).toBe(language.id);
    });

    it("should return 401 without auth token", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/movies",
        payload: makeMoviePayload("some-id")
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /api/v1/movies", () => {
    it("should return 200 with paginated movies", async () => {
      const prisma = getE2ePrismaClient();
      const language = await insertLanguage(prisma);
      const user = await registerUser();
      const app = getApp();

      await app.inject({
        method: "POST",
        url: "/api/v1/movies",
        headers: authHeaders(user.accessToken),
        payload: makeMoviePayload(language.id)
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/movies",
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("meta");
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data).toHaveLength(1);
    });

    it("should return 401 without auth token", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/movies"
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /api/v1/movies/:id", () => {
    it("should return 200 with the movie", async () => {
      const prisma = getE2ePrismaClient();
      const language = await insertLanguage(prisma);
      const user = await registerUser();
      const app = getApp();

      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/movies",
        headers: authHeaders(user.accessToken),
        payload: makeMoviePayload(language.id)
      });
      const movieId = createRes.json().id;

      const response = await app.inject({
        method: "GET",
        url: `/api/v1/movies/${movieId}`,
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().id).toBe(movieId);
    });

    it("should return 404 for non-existent movie", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/movies/01935f6a-7c2d-7000-8000-000000000000",
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(404);
      expect(response.json().code).toBe("MOVIE_NOT_FOUND");
    });
  });

  describe("PUT /api/v1/movies/:id", () => {
    it("should update a movie and return 200", async () => {
      const prisma = getE2ePrismaClient();
      const language = await insertLanguage(prisma);
      const user = await registerUser();
      const app = getApp();

      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/movies",
        headers: authHeaders(user.accessToken),
        payload: makeMoviePayload(language.id)
      });
      const movieId = createRes.json().id;

      const response = await app.inject({
        method: "PUT",
        url: `/api/v1/movies/${movieId}`,
        headers: authHeaders(user.accessToken),
        payload: { title: "Updated Title" }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().title).toBe("Updated Title");
    });
  });

  describe("DELETE /api/v1/movies/:id", () => {
    it("should delete a movie and return 204", async () => {
      const prisma = getE2ePrismaClient();
      const language = await insertLanguage(prisma);
      const user = await registerUser();
      const app = getApp();

      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/movies",
        headers: authHeaders(user.accessToken),
        payload: makeMoviePayload(language.id)
      });
      const movieId = createRes.json().id;

      const response = await app.inject({
        method: "DELETE",
        url: `/api/v1/movies/${movieId}`,
        headers: authHeaders(user.accessToken)
      });

      expect(response.statusCode).toBe(204);
    });
  });

  describe("POST /api/v1/movies/:id/rate", () => {
    it("should rate a movie and return 200", async () => {
      const prisma = getE2ePrismaClient();
      const language = await insertLanguage(prisma);
      const user = await registerUser();
      const app = getApp();

      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/movies",
        headers: authHeaders(user.accessToken),
        payload: makeMoviePayload(language.id)
      });
      const movieId = createRes.json().id;

      const response = await app.inject({
        method: "POST",
        url: `/api/v1/movies/${movieId}/rate`,
        headers: authHeaders(user.accessToken),
        payload: { value: 8 }
      });

      expect(response.statusCode).toBe(200);
    });

    it("should return 400 for invalid rating value", async () => {
      const prisma = getE2ePrismaClient();
      const language = await insertLanguage(prisma);
      const user = await registerUser();
      const app = getApp();

      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/movies",
        headers: authHeaders(user.accessToken),
        payload: makeMoviePayload(language.id)
      });
      const movieId = createRes.json().id;

      const response = await app.inject({
        method: "POST",
        url: `/api/v1/movies/${movieId}/rate`,
        headers: authHeaders(user.accessToken),
        payload: { value: 15 }
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
