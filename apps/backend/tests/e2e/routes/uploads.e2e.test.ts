import { describe, it, expect } from "vitest";
import { getApp } from "../helpers/app-context";
import { authHeaders, registerUser } from "../helpers/auth-helper";

describe("Upload signed-url route", () => {
  describe("POST /api/v1/uploads/signed-url", () => {
    it("should return 200 and signed upload data for valid payload", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/uploads/signed-url",
        headers: authHeaders(user.accessToken),
        payload: {
          fileName: "avatar.png",
          contentType: "image/png"
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        uploadUrl: expect.any(String),
        fileUrl: expect.any(String),
        key: expect.stringMatching(new RegExp(`^uploads/${user.id}/`))
      });
    });

    it("should return 401 without auth token", async () => {
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/uploads/signed-url",
        payload: {
          fileName: "photo.jpg",
          contentType: "image/jpeg"
        }
      });

      expect(response.statusCode).toBe(401);
    });

    it("should return 400 for missing fileName", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/uploads/signed-url",
        headers: authHeaders(user.accessToken),
        payload: {
          contentType: "image/jpeg"
        }
      });

      expect(response.statusCode).toBe(400);
    });

    it("should return 400 for invalid contentType", async () => {
      const user = await registerUser();
      const app = getApp();

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/uploads/signed-url",
        headers: authHeaders(user.accessToken),
        payload: {
          fileName: "document.pdf",
          contentType: "application/pdf"
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
