import type { InputJsonValue } from "@prisma/client/runtime/client";
import type { OutboxEventRepository } from "@/application/interfaces/repositories";
import type { OutboxEvent } from "@/domain/entities";
import { OutboxEventStatusEnum } from "@/domain/enums";
import { PrismaOutboxEventMapper } from "@/infrastructure/database/mappers";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";
import type { OutboxEventModel } from "@/infrastructure/database/prisma/generated/prisma/models/OutboxEvent";

export class PrismaOutboxEventRepository implements OutboxEventRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async create(entry: OutboxEvent): Promise<void> {
    await this.db.outboxEvent.create({
      data: {
        id: entry.id.toString(),
        type: entry.type,
        payload: entry.payload as InputJsonValue,
        status: entry.status,
        retryCount: entry.retryCount,
        error: entry.error,
        createdAt: entry.createdAt,
        scheduledFor: entry.scheduledFor,
        processedAt: entry.processedAt,
        resourceId: entry.resourceId?.toString() ?? null
      }
    });
  }

  async findPendingBatch(limit: number): Promise<OutboxEvent[]> {
    const now = new Date();
    const rows = await this.db.$queryRaw<OutboxEventModel[]>`
      SELECT id, type, payload, status, "retryCount", error,
             "createdAt", "scheduledFor", "processedAt", "resourceId"
      FROM "OutboxEvent"
      WHERE status = ${OutboxEventStatusEnum.PENDING}
        AND ("scheduledFor" IS NULL OR "scheduledFor" <= ${now})
      ORDER BY id ASC
      LIMIT ${limit}
      FOR UPDATE SKIP LOCKED
    `;

    return rows.map(PrismaOutboxEventMapper.toDomain);
  }

  async update(entry: OutboxEvent): Promise<OutboxEvent | null> {
    try {
      const raw = await this.db.outboxEvent.update({
        where: { id: entry.id.toString() },
        data: {
          status: entry.status,
          retryCount: entry.retryCount,
          error: entry.error,
          processedAt: entry.processedAt
        }
      });
      return PrismaOutboxEventMapper.toDomain(raw);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  }
}
