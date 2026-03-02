import { OutboxEvent } from "@/domain/entities";
import type {
  OutboxEventStatusEnum,
  OutboxEventTypeEnum
} from "@/domain/enums";
import { Uuid } from "@/domain/value-objects";
import type { OutboxEventModel } from "@/infrastructure/database/prisma/generated/prisma/models/OutboxEvent";

export class PrismaOutboxEventMapper {
  static toDomain(raw: OutboxEventModel): OutboxEvent {
    return OutboxEvent.reconstitute({
      id: Uuid.reconstitute(raw.id),
      type: raw.type as OutboxEventTypeEnum,
      payload: raw.payload as Record<string, unknown>,
      status: raw.status as OutboxEventStatusEnum,
      retryCount: raw.retryCount,
      error: raw.error,
      createdAt: raw.createdAt,
      scheduledFor: raw.scheduledFor,
      processedAt: raw.processedAt,
      resourceId: raw.resourceId ? Uuid.reconstitute(raw.resourceId) : null
    });
  }
}
