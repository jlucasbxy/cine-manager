import type { NotificationOutboxRepository } from "@/application/interfaces/repositories";
import { NotificationOutbox } from "@/domain/entities";
import { NotificationStatusEnum } from "@/domain/enums";
import { prisma } from "@/infra/database/prisma";
import { PrismaNotificationOutboxMapper } from "@/infra/database/mappers";
import type { InputJsonValue } from "@prisma/client/runtime/client";
import type { TransactionClient } from "@/infra/database/prisma/generated/prisma/internal/prismaNamespace";

export class PrismaNotificationOutboxRepository implements NotificationOutboxRepository {
  private readonly db: typeof prisma | TransactionClient;

  constructor(client?: TransactionClient) {
    this.db = client ?? prisma;
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
