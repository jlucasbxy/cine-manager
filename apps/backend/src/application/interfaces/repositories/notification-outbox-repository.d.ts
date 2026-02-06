import { NotificationOutbox } from "@/domain/entities";

export interface NotificationOutboxRepository {
  create(entry: NotificationOutbox): Promise<void>;
}
