import type { OutboxEvent } from "@/domain/entities";
import type { Uuid } from "@/domain/value-objects";

export interface OutboxEventRepository {
  create(entry: OutboxEvent): Promise<void>;
  findPendingBatch(limit: number): Promise<OutboxEvent[]>;
  update(entry: OutboxEvent): Promise<OutboxEvent | null>;
  deletePendingByResourceId(resourceId: Uuid): Promise<number>;
}
