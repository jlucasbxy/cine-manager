import type { NotificationOutboxModel } from "@/infrastructure/database/prisma/generated/prisma/models/NotificationOutbox";
import { NotificationOutbox } from "@/domain/entities";
import type {
  NotificationTypeEnum,
  NotificationStatusEnum
} from "@/domain/enums";
import { Uuid } from "@/domain/value-objects";

export class PrismaNotificationOutboxMapper {
  static toDomain(raw: NotificationOutboxModel): NotificationOutbox {
    return NotificationOutbox.reconstitute({
      id: Uuid.reconstitute(raw.id),
      type: raw.type as NotificationTypeEnum,
      payload: raw.payload as Record<string, unknown>,
      status: raw.status as NotificationStatusEnum,
      retryCount: raw.retryCount,
      error: raw.error,
      createdAt: raw.createdAt,
      scheduledFor: raw.scheduledFor,
      processedAt: raw.processedAt,
      movieId: raw.movieId ? Uuid.reconstitute(raw.movieId) : null
    });
  }
}
