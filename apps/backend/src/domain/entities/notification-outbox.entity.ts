import { Uuid } from "@/domain/value-objects";
import { NotificationTypeEnum, NotificationStatusEnum } from "@/domain/enums";

interface CreateNotificationOutboxProps {
  type: NotificationTypeEnum;
  payload: Record<string, unknown>;
}

interface ReconstituteNotificationOutboxProps {
  id: Uuid;
  type: NotificationTypeEnum;
  payload: Record<string, unknown>;
  status: NotificationStatusEnum;
  retryCount: number;
  error: string | null;
  createdAt: Date;
  processedAt: Date | null;
}

export class NotificationOutbox {
  readonly id: Uuid;
  readonly type: NotificationTypeEnum;
  readonly payload: Record<string, unknown>;
  readonly status: NotificationStatusEnum;
  readonly retryCount: number;
  readonly error: string | null;
  readonly createdAt: Date;
  readonly processedAt: Date | null;

  private constructor(data: {
    id: Uuid;
    type: NotificationTypeEnum;
    payload: Record<string, unknown>;
    status: NotificationStatusEnum;
    retryCount: number;
    error: string | null;
    createdAt: Date;
    processedAt: Date | null;
  }) {
    this.id = data.id;
    this.type = data.type;
    this.payload = data.payload;
    this.status = data.status;
    this.retryCount = data.retryCount;
    this.error = data.error;
    this.createdAt = data.createdAt;
    this.processedAt = data.processedAt;
  }

  static create(props: CreateNotificationOutboxProps): NotificationOutbox {
    return new NotificationOutbox({
      id: Uuid.generate(),
      type: props.type,
      payload: props.payload,
      status: NotificationStatusEnum.PENDING,
      retryCount: 0,
      error: null,
      createdAt: new Date(),
      processedAt: null
    });
  }

  static reconstitute(
    props: ReconstituteNotificationOutboxProps
  ): NotificationOutbox {
    return new NotificationOutbox({
      id: props.id,
      type: props.type,
      payload: props.payload,
      status: props.status,
      retryCount: props.retryCount,
      error: props.error,
      createdAt: props.createdAt,
      processedAt: props.processedAt
    });
  }

  markAsProcessed(): NotificationOutbox {
    return new NotificationOutbox({
      id: this.id,
      type: this.type,
      payload: this.payload,
      status: NotificationStatusEnum.PROCESSED,
      retryCount: this.retryCount,
      error: this.error,
      createdAt: this.createdAt,
      processedAt: new Date()
    });
  }

  markAsFailed(error: string): NotificationOutbox {
    return new NotificationOutbox({
      id: this.id,
      type: this.type,
      payload: this.payload,
      status: NotificationStatusEnum.FAILED,
      retryCount: this.retryCount + 1,
      error,
      createdAt: this.createdAt,
      processedAt: this.processedAt
    });
  }

  recordFailure(error: string): NotificationOutbox {
    return new NotificationOutbox({
      id: this.id,
      type: this.type,
      payload: this.payload,
      status: NotificationStatusEnum.PENDING,
      retryCount: this.retryCount + 1,
      error,
      createdAt: this.createdAt,
      processedAt: this.processedAt
    });
  }
}
