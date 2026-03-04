import { PasswordResetToken } from "@/domain/entities/password-reset-token.entity";
import { Token, Uuid } from "@/domain/value-objects";
import { daysAgo, daysFromNow } from "../../factories/utils/date.factory";

describe("PasswordResetToken", () => {
  describe("create", () => {
    it("generates id, token, and sets expiresAt in the future", () => {
      const userId = Uuid.generate();
      const prt = PasswordResetToken.create({ userId, expiresIn: "1h" });

      expect(prt.id.toString()).toBeTruthy();
      expect(prt.token.toString()).toHaveLength(64);
      expect(prt.userId).toBe(userId);
      expect(prt.expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(prt.usedAt).toBeNull();
    });
  });

  describe("reconstitute", () => {
    it("preserves all given props", () => {
      const props = {
        id: Uuid.generate(),
        token: Token.generate(),
        userId: Uuid.generate(),
        expiresAt: daysFromNow(1),
        usedAt: null,
        createdAt: new Date()
      };
      const prt = PasswordResetToken.reconstitute(props);
      expect(prt.id).toBe(props.id);
      expect(prt.usedAt).toBeNull();
    });
  });

  describe("isExpired", () => {
    it("returns false when not expired", () => {
      const prt = PasswordResetToken.create({
        userId: Uuid.generate(),
        expiresIn: "1h"
      });
      expect(prt.isExpired()).toBe(false);
    });

    it("returns true when expired", () => {
      const prt = PasswordResetToken.reconstitute({
        id: Uuid.generate(),
        token: Token.generate(),
        userId: Uuid.generate(),
        expiresAt: daysAgo(1),
        usedAt: null,
        createdAt: new Date()
      });
      expect(prt.isExpired()).toBe(true);
    });
  });

  describe("isUsed", () => {
    it("returns false when not used", () => {
      const prt = PasswordResetToken.create({
        userId: Uuid.generate(),
        expiresIn: "1h"
      });
      expect(prt.isUsed()).toBe(false);
    });

    it("returns true when used", () => {
      const prt = PasswordResetToken.reconstitute({
        id: Uuid.generate(),
        token: Token.generate(),
        userId: Uuid.generate(),
        expiresAt: daysFromNow(1),
        usedAt: new Date(),
        createdAt: new Date()
      });
      expect(prt.isUsed()).toBe(true);
    });
  });

  describe("isValid", () => {
    it("returns true when not expired and not used", () => {
      const prt = PasswordResetToken.create({
        userId: Uuid.generate(),
        expiresIn: "1h"
      });
      expect(prt.isValid()).toBe(true);
    });

    it("returns false when expired", () => {
      const prt = PasswordResetToken.reconstitute({
        id: Uuid.generate(),
        token: Token.generate(),
        userId: Uuid.generate(),
        expiresAt: daysAgo(1),
        usedAt: null,
        createdAt: new Date()
      });
      expect(prt.isValid()).toBe(false);
    });

    it("returns false when used", () => {
      const prt = PasswordResetToken.reconstitute({
        id: Uuid.generate(),
        token: Token.generate(),
        userId: Uuid.generate(),
        expiresAt: daysFromNow(1),
        usedAt: new Date(),
        createdAt: new Date()
      });
      expect(prt.isValid()).toBe(false);
    });
  });

  describe("markAsUsed", () => {
    it("returns new token with usedAt set", () => {
      const original = PasswordResetToken.create({
        userId: Uuid.generate(),
        expiresIn: "1h"
      });
      const used = original.markAsUsed();

      expect(used.usedAt).toBeInstanceOf(Date);
      expect(used.isUsed()).toBe(true);
      expect(original.usedAt).toBeNull();
    });
  });
});
