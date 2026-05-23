import { PrismaTransactionManager } from "@/infrastructure/providers";
import { makePgBoss } from "@/main/factories/queue";
import { makeRefreshToken, makeUser } from "../../factories";
import { getIntegrationPrismaClient } from "../helpers/integration-context";

describe("PrismaTransactionManager integration", () => {
  const prisma = getIntegrationPrismaClient();
  const manager = new PrismaTransactionManager(prisma, makePgBoss());

  it("commits writes when transaction succeeds", async () => {
    const user = makeUser();
    const refreshToken = makeRefreshToken({
      userId: user.id,
      token: "a".repeat(64)
    });

    await manager.execute(async (repos) => {
      await repos.userRepository.create(user);
      await repos.refreshTokenRepository.create(refreshToken);
    });

    const persistedUser = await prisma.user.findUnique({
      where: { id: user.id.toString() }
    });
    const persistedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken.token.toString() }
    });

    expect(persistedUser).not.toBeNull();
    expect(persistedToken).not.toBeNull();
  });

  it("rolls back writes when callback throws", async () => {
    const user = makeUser();

    await expect(
      manager.execute(async (repos) => {
        await repos.userRepository.create(user);
        throw new Error("fail-transaction");
      })
    ).rejects.toThrow("fail-transaction");

    const persistedUser = await prisma.user.findUnique({
      where: { id: user.id.toString() }
    });

    expect(persistedUser).toBeNull();
  });
});
