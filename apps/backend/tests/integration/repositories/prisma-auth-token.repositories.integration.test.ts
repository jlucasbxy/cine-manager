import { PasswordResetToken } from "@/domain/entities";
import { Token, Uuid } from "@/domain/value-objects";
import {
  PrismaPasswordResetTokenRepository,
  PrismaRefreshTokenRepository
} from "@/infrastructure/database/repositories";
import { makeRefreshToken } from "../../factories";
import { insertUser } from "../helpers/fixtures";
import { getIntegrationPrismaClient } from "../helpers/integration-context";

describe("PrismaRefreshTokenRepository integration", () => {
  const prisma = getIntegrationPrismaClient();
  const repository = new PrismaRefreshTokenRepository(prisma);

  it("creates, finds and updates tokens", async () => {
    const user = await insertUser(prisma);
    const token = makeRefreshToken({
      userId: Uuid.create(user.id),
      token: "a".repeat(64)
    });

    const created = await repository.create(token);
    const found = await repository.findByTokenForUpdate(token.token);
    const revokedAt = new Date("2025-01-01T00:00:00.000Z");
    const updated = await repository.updateByToken(token.token, { revokedAt });

    expect(created.id.toString()).toBe(token.id.toString());
    expect(found?.id.toString()).toBe(token.id.toString());
    expect(updated?.revokedAt?.toISOString()).toBe(revokedAt.toISOString());
  });

  it("updates many and deletes expired tokens", async () => {
    const user = await insertUser(prisma);
    const userId = Uuid.create(user.id);

    const activeToken = makeRefreshToken({
      userId,
      token: "b".repeat(64),
      expiresAt: new Date(Date.now() + 86_400_000)
    });
    const expiredToken = makeRefreshToken({
      userId,
      token: "c".repeat(64),
      expiresAt: new Date(Date.now() - 86_400_000)
    });

    await repository.create(activeToken);
    await repository.create(expiredToken);

    const revokedCount = await repository.updateManyByUserId(userId, {
      revokedAt: new Date("2025-01-10T00:00:00.000Z")
    });
    await repository.deleteExpiredByUserId(userId);

    const remaining = await prisma.refreshToken.findMany({
      where: { userId: user.id }
    });

    expect(revokedCount).toBe(2);
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.token).toBe(activeToken.token.toString());
  });
});

describe("PrismaPasswordResetTokenRepository integration", () => {
  const prisma = getIntegrationPrismaClient();
  const repository = new PrismaPasswordResetTokenRepository(prisma);

  const makePasswordResetToken = (
    userId: Uuid,
    token: string
  ): PasswordResetToken => {
    return PasswordResetToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create(token),
      userId,
      expiresAt: new Date(Date.now() + 3_600_000),
      usedAt: null,
      createdAt: new Date()
    });
  };

  it("creates, finds and updates token state", async () => {
    const user = await insertUser(prisma);
    const userId = Uuid.create(user.id);
    const token = makePasswordResetToken(userId, "d".repeat(64));

    await repository.create(token);
    const found = await repository.findByTokenForUpdate(token.token);
    await repository.update(token.markAsUsed());
    const afterUse = await repository.findByTokenForUpdate(token.token);

    expect(found?.id.toString()).toBe(token.id.toString());
    expect(afterUse?.usedAt).not.toBeNull();
  });

  it("deletes expired tokens and tokens by user", async () => {
    const userA = await insertUser(prisma);
    const userB = await insertUser(prisma);
    const userAId = Uuid.create(userA.id);
    const userBId = Uuid.create(userB.id);

    const expired = PasswordResetToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create("e".repeat(64)),
      userId: userAId,
      expiresAt: new Date(Date.now() - 60_000),
      usedAt: null,
      createdAt: new Date()
    });
    const activeA = makePasswordResetToken(userAId, "f".repeat(64));
    const activeB = makePasswordResetToken(userBId, "1".repeat(64));

    await repository.create(expired);
    await repository.create(activeA);
    await repository.create(activeB);

    await repository.deleteExpired();
    await repository.deleteByUserId(userAId);

    const remaining = await prisma.passwordResetToken.findMany();
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.userId).toBe(userB.id);
  });
});
