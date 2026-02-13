import { NotificationOutbox } from "@/domain/entities";

export interface NotificationOutboxRepository {
  create(entry: NotificationOutbox): Promise<void>;
  findPendingBatch(limit: number): Promise<NotificationOutbox[]>;
  update(entry: NotificationOutbox): Promise<void>;
  updateBatch(entries: NotificationOutbox[]): Promise<void>;
}
