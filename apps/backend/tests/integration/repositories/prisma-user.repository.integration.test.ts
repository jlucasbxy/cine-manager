import { uuidv7 } from "uuidv7";
import { Email } from "@/domain/value-objects";
import { PrismaUserRepository } from "@/infrastructure/database/repositories";
import { makeUser } from "../../factories";
import { getIntegrationPrismaClient } from "../helpers/integration-context";

describe("PrismaUserRepository integration", () => {
  const prisma = getIntegrationPrismaClient();
  const repository = new PrismaUserRepository(prisma);

  it("creates and retrieves users by id/email", async () => {
    const email = `${uuidv7()}@example.com`;
    const user = makeUser({ email });

    const created = await repository.create(user);
    const byId = await repository.findById(user.id);
    const byEmail = await repository.findByEmail(user.email);
    const existingId = await repository.existsByEmail(user.email);
    const locked = await repository.findByIdForUpdate(user.id);

    expect(created?.id.toString()).toBe(user.id.toString());
    expect(byId?.email.toString()).toBe(email);
    expect(byEmail?.id.toString()).toBe(user.id.toString());
    expect(existingId?.toString()).toBe(user.id.toString());
    expect(locked?.id.toString()).toBe(user.id.toString());
  });

  it("returns null when creating duplicate emails", async () => {
    const email = `${uuidv7()}@example.com`;
    const userA = makeUser({ email });
    const userB = makeUser({ email });

    const createdA = await repository.create(userA);
    const createdB = await repository.create(userB);

    expect(createdA).not.toBeNull();
    expect(createdB).toBeNull();
  });

  it("updates and deletes users", async () => {
    const user = makeUser({ email: `${uuidv7()}@example.com` });
    await repository.create(user);

    const updated = await repository.update(user.id, {
      name: "Updated Name",
      avatarUrl: "https://example.com/avatar.jpg",
      updatedAt: new Date("2025-01-01T00:00:00.000Z")
    });

    expect(updated?.name).toBe("Updated Name");
    expect(updated?.avatarUrl).toBe("https://example.com/avatar.jpg");

    await repository.delete(user.id);
    const afterDelete = await repository.findById(user.id);
    expect(afterDelete).toBeNull();
  });

  it("returns null for missing users on update", async () => {
    const user = makeUser({ email: `${uuidv7()}@example.com` });

    const updated = await repository.update(user.id, {
      name: "Missing",
      updatedAt: new Date()
    });

    expect(updated).toBeNull();
    expect(
      await repository.existsByEmail(Email.create(user.email.toString()))
    ).toBeNull();
  });
});
