import { RefreshToken } from "@/domain/entities/refresh-token.entity";
import { Token, Uuid } from "@/domain/value-objects";
import { daysAgo, daysFromNow } from "../../../factories/utils/date.factory";

describe("RefreshToken", () => {
  describe("create", () => {
    it("generates id, token, and sets expiresAt in the future", () => {
      const userId = Uuid.generate();
      const token = RefreshToken.create({ userId, expiresIn: "7d" });

      expect(token.id.toString()).toBeTruthy();
      expect(token.token.toString()).toHaveLength(64);
      expect(token.userId).toBe(userId);
      expect(token.expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(token.revokedAt).toBeNull();
      expect(token.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("reconstitute", () => {
    it("preserves all given props", () => {
      const props = {
        id: Uuid.generate(),
        token: Token.generate(),
        userId: Uuid.generate(),
        expiresAt: daysFromNow(1),
        revokedAt: null,
        createdAt: new Date()
      };
      const rt = RefreshToken.reconstitute(props);
      expect(rt.id).toBe(props.id);
      expect(rt.token).toBe(props.token);
      expect(rt.revokedAt).toBeNull();
    });
  });

  describe("isExpired", () => {
    it("returns false when not expired", () => {
      const token = RefreshToken.create({
        userId: Uuid.generate(),
        expiresIn: "7d"
      });
      expect(token.isExpired()).toBe(false);
    });

    it("returns true when expired", () => {
      const token = RefreshToken.reconstitute({
        id: Uuid.generate(),
        token: Token.generate(),
        userId: Uuid.generate(),
        expiresAt: daysAgo(1),
        revokedAt: null,
        createdAt: daysAgo(2)
      });
      expect(token.isExpired()).toBe(true);
    });
  });

  describe("isRevoked", () => {
    it("returns false when not revoked", () => {
      const token = RefreshToken.create({
        userId: Uuid.generate(),
        expiresIn: "7d"
      });
      expect(token.isRevoked()).toBe(false);
    });

    it("returns true when revoked", () => {
      const token = RefreshToken.reconstitute({
        id: Uuid.generate(),
        token: Token.generate(),
        userId: Uuid.generate(),
        expiresAt: daysFromNow(1),
        revokedAt: new Date(),
        createdAt: new Date()
      });
      expect(token.isRevoked()).toBe(true);
    });
  });

  describe("isValid", () => {
    it("returns true when not expired and not revoked", () => {
      const token = RefreshToken.create({
        userId: Uuid.generate(),
        expiresIn: "7d"
      });
      expect(token.isValid()).toBe(true);
    });

    it("returns false when expired", () => {
      const token = RefreshToken.reconstitute({
        id: Uuid.generate(),
        token: Token.generate(),
        userId: Uuid.generate(),
        expiresAt: daysAgo(1),
        revokedAt: null,
        createdAt: new Date()
      });
      expect(token.isValid()).toBe(false);
    });

    it("returns false when revoked", () => {
      const token = RefreshToken.reconstitute({
        id: Uuid.generate(),
        token: Token.generate(),
        userId: Uuid.generate(),
        expiresAt: daysFromNow(1),
        revokedAt: new Date(),
        createdAt: new Date()
      });
      expect(token.isValid()).toBe(false);
    });
  });

  describe("revoke", () => {
    it("returns new token with revokedAt set", () => {
      const original = RefreshToken.create({
        userId: Uuid.generate(),
        expiresIn: "7d"
      });
      const revoked = original.revoke();

      expect(revoked.revokedAt).toBeInstanceOf(Date);
      expect(revoked.isRevoked()).toBe(true);
      expect(original.revokedAt).toBeNull();
    });
  });
});
