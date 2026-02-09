import type { NotificationOutboxRepository } from "@/application/interfaces/repositories";
import { NotificationOutbox } from "@/domain/entities";
import { NotificationStatusEnum } from "@/domain/enums";
import type { PrismaDatabase } from "@/infra/database/prisma";
import { PrismaNotificationOutboxMapper } from "@/infra/database/mappers";
import type { InputJsonValue } from "@prisma/client/runtime/client";

export class PrismaNotificationOutboxRepository implements NotificationOutboxRepository {
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
        processedAt: entry.processedAt
      }
    });
  }

  async findPendingBatch(limit: number): Promise<NotificationOutbox[]> {
    const rows = await this.db.notificationOutbox.findMany({
      where: { status: NotificationStatusEnum.PENDING },
      orderBy: { createdAt: "asc" },
      take: limit
    });

    return rows.map(PrismaNotificationOutboxMapper.toDomain);
  }

  async update(entry: NotificationOutbox): Promise<void> {
    await this.db.notificationOutbox.update({
      where: { id: entry.id.toString() },
      data: {
        status: entry.status,
        retryCount: entry.retryCount,
        error: entry.error,
        processedAt: entry.processedAt
      }
    });
  }
}
