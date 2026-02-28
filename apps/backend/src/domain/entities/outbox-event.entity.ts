import {
  OutboxEventStatusEnum,
  type OutboxEventTypeEnum
} from "@/domain/enums";
import { Uuid } from "@/domain/value-objects";

interface CreateOutboxEventProps {
  type: OutboxEventTypeEnum;
  payload: Record<string, unknown>;
  movieId?: Uuid | null;
  scheduledFor?: Date | null;
}

interface ReconstituteOutboxEventProps {
  id: Uuid;
  type: OutboxEventTypeEnum;
  payload: Record<string, unknown>;
  status: OutboxEventStatusEnum;
  retryCount: number;
  error: string | null;
  createdAt: Date;
  scheduledFor: Date | null;
  processedAt: Date | null;
  movieId: Uuid | null;
}

export class OutboxEvent {
  readonly id: Uuid;
  readonly type: OutboxEventTypeEnum;
  readonly payload: Record<string, unknown>;
  readonly status: OutboxEventStatusEnum;
  readonly retryCount: number;
  readonly error: string | null;
  readonly createdAt: Date;
  readonly scheduledFor: Date | null;
  readonly processedAt: Date | null;
  readonly movieId: Uuid | null;

  private constructor(data: {
    id: Uuid;
    type: OutboxEventTypeEnum;
    payload: Record<string, unknown>;
    status: OutboxEventStatusEnum;
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

  static create(props: CreateOutboxEventProps): OutboxEvent {
    return new OutboxEvent({
      id: Uuid.generate(),
      type: props.type,
      payload: props.payload,
      status: OutboxEventStatusEnum.PENDING,
      retryCount: 0,
      error: null,
      createdAt: new Date(),
      scheduledFor: props.scheduledFor ?? null,
      processedAt: null,
      movieId: props.movieId ?? null
    });
  }

  static reconstitute(props: ReconstituteOutboxEventProps): OutboxEvent {
    return new OutboxEvent({
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

  markAsProcessed(): OutboxEvent {
    return new OutboxEvent({
      id: this.id,
      type: this.type,
      payload: this.payload,
      status: OutboxEventStatusEnum.PROCESSED,
      retryCount: this.retryCount,
      error: this.error,
      createdAt: this.createdAt,
      scheduledFor: this.scheduledFor,
      processedAt: new Date(),
      movieId: this.movieId
    });
  }

  markAsFailed(error: string): OutboxEvent {
    return new OutboxEvent({
      id: this.id,
      type: this.type,
      payload: this.payload,
      status: OutboxEventStatusEnum.FAILED,
      retryCount: this.retryCount + 1,
      error,
      createdAt: this.createdAt,
      scheduledFor: this.scheduledFor,
      processedAt: this.processedAt,
      movieId: this.movieId
    });
  }

  recordFailure(error: string): OutboxEvent {
    return new OutboxEvent({
      id: this.id,
      type: this.type,
      payload: this.payload,
      status: OutboxEventStatusEnum.PENDING,
      retryCount: this.retryCount + 1,
      error,
      createdAt: this.createdAt,
      scheduledFor: this.scheduledFor,
      processedAt: this.processedAt,
      movieId: this.movieId
    });
  }
}
