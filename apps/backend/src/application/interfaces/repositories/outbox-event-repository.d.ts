import { OutboxEvent } from "@/domain/entities";

export interface OutboxEventRepository {
  create(entry: OutboxEvent): Promise<void>;
  findPendingBatch(limit: number): Promise<OutboxEvent[]>;
  update(entry: OutboxEvent): Promise<OutboxEvent | null>;
}
