import { Uuid } from "@/domain/value-objects";
import {
  type NotificationTypeEnum,
  NotificationStatusEnum
} from "@/domain/enums";

interface CreateNotificationOutboxProps {
  type: NotificationTypeEnum;
  payload: Record<string, unknown>;
  movieId?: Uuid | null;
  scheduledFor?: Date | null;
}

interface ReconstituteNotificationOutboxProps {
  id: Uuid;
  type: NotificationTypeEnum;
  payload: Record<string, unknown>;
  status: NotificationStatusEnum;
  retryCount: number;
  error: string | null;
  createdAt: Date;
  scheduledFor: Date | null;
  processedAt: Date | null;
  movieId: Uuid | null;
}

export class NotificationOutbox {
  readonly id: Uuid;
  readonly type: NotificationTypeEnum;
  readonly payload: Record<string, unknown>;
  readonly status: NotificationStatusEnum;
  readonly retryCount: number;
  readonly error: string | null;
  readonly createdAt: Date;
  readonly scheduledFor: Date | null;
  readonly processedAt: Date | null;
  readonly movieId: Uuid | null;

  private constructor(data: {
    id: Uuid;
    type: NotificationTypeEnum;
    payload: Record<string, unknown>;
    status: NotificationStatusEnum;
    retryCount: number;
    error: string | null;
    createdAt: Date;
    scheduledFor: Date | null;
    processedAt: Date | null;
    movieId: Uuid | null;
  }) {
    this.id = data.id;
    this.type = data.type;
    this.payload = data.payload;
    this.status = data.status;
    this.retryCount = data.retryCount;
    this.error = data.error;
    this.createdAt = data.createdAt;
    this.scheduledFor = data.scheduledFor;
    this.processedAt = data.processedAt;
    this.movieId = data.movieId;
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
      scheduledFor: props.scheduledFor ?? null,
      processedAt: null,
      movieId: props.movieId ?? null
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
      scheduledFor: props.scheduledFor,
      processedAt: props.processedAt,
      movieId: props.movieId
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
      scheduledFor: this.scheduledFor,
      processedAt: new Date(),
      movieId: this.movieId
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
      scheduledFor: this.scheduledFor,
      processedAt: this.processedAt,
      movieId: this.movieId
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
      scheduledFor: this.scheduledFor,
      processedAt: this.processedAt,
      movieId: this.movieId
    });
  }
}
