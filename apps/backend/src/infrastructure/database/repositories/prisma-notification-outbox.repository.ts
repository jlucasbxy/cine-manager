import type { InputJsonValue } from "@prisma/client/runtime/client";
import type { NotificationOutboxRepository } from "@/application/interfaces/repositories";
import type { NotificationOutbox } from "@/domain/entities";
import { NotificationStatusEnum } from "@/domain/enums";
import { PrismaNotificationOutboxMapper } from "@/infrastructure/database/mappers";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";

export class PrismaNotificationOutboxRepository
  implements NotificationOutboxRepository
{
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async create(entry: NotificationOutbox): Promise<void> {
    await this.db.notificationOutbox.create({
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

  async findPendingBatch(limit: number): Promise<NotificationOutbox[]> {
    const now = new Date();
    const rows = await this.db.notificationOutbox.findMany({
      where: {
        status: NotificationStatusEnum.PENDING,
        OR: [{ scheduledFor: null }, { scheduledFor: { lte: now } }]
      },
      orderBy: { createdAt: "asc" },
      take: limit
    });

    return rows.map(PrismaNotificationOutboxMapper.toDomain);
  }

  async update(entry: NotificationOutbox): Promise<NotificationOutbox | null> {
    try {
      const raw = await this.db.notificationOutbox.update({
        where: { id: entry.id.toString() },
        data: {
          status: entry.status,
          retryCount: entry.retryCount,
          error: entry.error,
          processedAt: entry.processedAt
        }
      });
      return PrismaNotificationOutboxMapper.toDomain(raw);
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
