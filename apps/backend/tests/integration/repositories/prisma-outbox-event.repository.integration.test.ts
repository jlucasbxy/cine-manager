import { OutboxEvent } from "@/domain/entities";
import { OutboxEventStatusEnum, OutboxEventTypeEnum } from "@/domain/enums";
import { Uuid } from "@/domain/value-objects";
import { PrismaOutboxEventRepository } from "@/infrastructure/database/repositories";
import { getIntegrationPrismaClient } from "../helpers/integration-context";

describe("PrismaOutboxEventRepository integration", () => {
  const prisma = getIntegrationPrismaClient();
  const repository = new PrismaOutboxEventRepository(prisma);

  it("finds only pending and due events", async () => {
    const due = OutboxEvent.reconstitute({
      id: Uuid.generate(),
      type: OutboxEventTypeEnum.WELCOME_EMAIL,
      payload: { to: "due@example.com" },
      status: OutboxEventStatusEnum.PENDING,
      retryCount: 0,
      error: null,
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      scheduledFor: new Date(Date.now() - 5_000),
      processedAt: null,
      resourceId: null
    });
    const future = OutboxEvent.reconstitute({
      id: Uuid.generate(),
      type: OutboxEventTypeEnum.WELCOME_EMAIL,
      payload: { to: "future@example.com" },
      status: OutboxEventStatusEnum.PENDING,
      retryCount: 0,
      error: null,
      createdAt: new Date("2025-01-01T00:00:01.000Z"),
      scheduledFor: new Date(Date.now() + 60_000),
      processedAt: null,
      resourceId: null
    });
    const failed = OutboxEvent.reconstitute({
      id: Uuid.generate(),
      type: OutboxEventTypeEnum.WELCOME_EMAIL,
      payload: { to: "failed@example.com" },
      status: OutboxEventStatusEnum.FAILED,
      retryCount: 1,
      error: "boom",
      createdAt: new Date("2025-01-01T00:00:02.000Z"),
      scheduledFor: null,
      processedAt: null,
      resourceId: null
    });

    await repository.create(due);
    await repository.create(future);
    await repository.create(failed);

    const batch = await repository.findPendingBatch(10);

    expect(batch.map((event) => event.id.toString())).toEqual([
      due.id.toString()
    ]);
  });

  it("updates an outbox event state", async () => {
    const entry = OutboxEvent.create({
      type: OutboxEventTypeEnum.PASSWORD_RESET_EMAIL,
      payload: { to: "user@example.com" }
    });

    await repository.create(entry);
    const updated = await repository.update(entry.markAsProcessed());

    expect(updated?.status).toBe(OutboxEventStatusEnum.PROCESSED);
    expect(updated?.processedAt).not.toBeNull();
  });

  it("deletes only pending events for the same resource id", async () => {
    const resourceId = Uuid.generate();
    const pending = OutboxEvent.reconstitute({
      id: Uuid.generate(),
      type: OutboxEventTypeEnum.STORAGE_FILE_DELETE,
      payload: { key: "a" },
      status: OutboxEventStatusEnum.PENDING,
      retryCount: 0,
      error: null,
      createdAt: new Date(),
      scheduledFor: null,
      processedAt: null,
      resourceId
    });
    const processed = OutboxEvent.reconstitute({
      id: Uuid.generate(),
      type: OutboxEventTypeEnum.STORAGE_FILE_DELETE,
      payload: { key: "a" },
      status: OutboxEventStatusEnum.PROCESSED,
      retryCount: 0,
      error: null,
      createdAt: new Date(),
      scheduledFor: null,
      processedAt: new Date(),
      resourceId
    });

    await repository.create(pending);
    await repository.create(processed);

    const deletedCount = await repository.deletePendingByResourceId(resourceId);
    const leftovers = await prisma.outboxEvent.findMany();

    expect(deletedCount).toBe(1);
    expect(leftovers).toHaveLength(1);
    expect(leftovers[0]?.status).toBe(OutboxEventStatusEnum.PROCESSED);
  });
});
