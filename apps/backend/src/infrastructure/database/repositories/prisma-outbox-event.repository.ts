import type { InputJsonValue } from "@prisma/client/runtime/client";
import type { OutboxEventRepository } from "@/application/interfaces/repositories";
import type { OutboxEvent } from "@/domain/entities";
import { OutboxEventStatusEnum } from "@/domain/enums";
import { PrismaOutboxEventMapper } from "@/infrastructure/database/mappers";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";

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
        movieId: entry.movieId?.toString() ?? null
      }
    });
  }

  async findPendingBatch(limit: number): Promise<OutboxEvent[]> {
    const now = new Date();
    const rows = await this.db.outboxEvent.findMany({
      where: {
        status: OutboxEventStatusEnum.PENDING,
        OR: [{ scheduledFor: null }, { scheduledFor: { lte: now } }]
      },
      orderBy: { createdAt: "asc" },
      take: limit
    });

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
