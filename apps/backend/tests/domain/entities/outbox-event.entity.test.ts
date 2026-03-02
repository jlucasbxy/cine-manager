import { OutboxEvent } from "@/domain/entities/outbox-event.entity";
import { OutboxEventStatusEnum } from "@/domain/enums/outbox-event-status.enum";
import { OutboxEventTypeEnum } from "@/domain/enums/outbox-event-type.enum";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

describe("OutboxEvent", () => {
  describe("create", () => {
    it("sets defaults: PENDING status, retryCount=0, error=null, processedAt=null", () => {
      const event = OutboxEvent.create({
        type: OutboxEventTypeEnum.WELCOME_EMAIL,
        payload: { to: "test@example.com" }
      });

      expect(event.id.toString()).toBeTruthy();
      expect(event.type).toBe(OutboxEventTypeEnum.WELCOME_EMAIL);
      expect(event.payload).toEqual({ to: "test@example.com" });
      expect(event.status).toBe(OutboxEventStatusEnum.PENDING);
      expect(event.retryCount).toBe(0);
      expect(event.error).toBeNull();
      expect(event.processedAt).toBeNull();
      expect(event.scheduledFor).toBeNull();
      expect(event.resourceId).toBeNull();
    });

    it("accepts optional scheduledFor and resourceId", () => {
      const resourceId = Uuid.generate();
      const scheduledFor = new Date("2025-01-01");
      const event = OutboxEvent.create({
        type: OutboxEventTypeEnum.MOVIE_RELEASE_DATE,
        payload: { to: "test@example.com" },
        resourceId,
        scheduledFor
      });

      expect(event.resourceId).toBe(resourceId);
      expect(event.scheduledFor).toBe(scheduledFor);
    });
  });

  describe("reconstitute", () => {
    it("preserves all given props", () => {
      const id = Uuid.generate();
      const now = new Date();
      const event = OutboxEvent.reconstitute({
        id,
        type: OutboxEventTypeEnum.STORAGE_FILE_DELETE,
        payload: { key: "test" },
        status: OutboxEventStatusEnum.PROCESSED,
        retryCount: 2,
        error: "some error",
        createdAt: now,
        scheduledFor: null,
        processedAt: now,
        resourceId: null
      });

      expect(event.id).toBe(id);
      expect(event.status).toBe(OutboxEventStatusEnum.PROCESSED);
      expect(event.retryCount).toBe(2);
      expect(event.error).toBe("some error");
    });
  });

  describe("markAsProcessed", () => {
    it("sets status to PROCESSED and processedAt", () => {
      const event = OutboxEvent.create({
        type: OutboxEventTypeEnum.WELCOME_EMAIL,
        payload: {}
      });
      const processed = event.markAsProcessed();

      expect(processed.status).toBe(OutboxEventStatusEnum.PROCESSED);
      expect(processed.processedAt).toBeInstanceOf(Date);
      expect(event.status).toBe(OutboxEventStatusEnum.PENDING);
    });
  });

  describe("markAsFailed", () => {
    it("sets status to FAILED, increments retryCount, stores error", () => {
      const event = OutboxEvent.create({
        type: OutboxEventTypeEnum.WELCOME_EMAIL,
        payload: {}
      });
      const failed = event.markAsFailed("connection timeout");

      expect(failed.status).toBe(OutboxEventStatusEnum.FAILED);
      expect(failed.retryCount).toBe(1);
      expect(failed.error).toBe("connection timeout");
      expect(event.retryCount).toBe(0);
    });
  });

  describe("recordFailure", () => {
    it("keeps PENDING status, increments retryCount, stores error", () => {
      const event = OutboxEvent.create({
        type: OutboxEventTypeEnum.WELCOME_EMAIL,
        payload: {}
      });
      const retried = event.recordFailure("temporary error");

      expect(retried.status).toBe(OutboxEventStatusEnum.PENDING);
      expect(retried.retryCount).toBe(1);
      expect(retried.error).toBe("temporary error");
    });
  });
});
