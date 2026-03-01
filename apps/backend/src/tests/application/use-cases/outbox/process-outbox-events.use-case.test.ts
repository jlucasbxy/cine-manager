import { ProcessOutboxEvents } from "@/application/use-cases/outbox/process-outbox-events.use-case";
import { OutboxEvent } from "@/domain/entities/outbox-event.entity";
import { OutboxEventStatusEnum } from "@/domain/enums/outbox-event-status.enum";
import { OutboxEventTypeEnum } from "@/domain/enums/outbox-event-type.enum";
import { Uuid } from "@/domain/value-objects";

function makeEvent(
  type: OutboxEventTypeEnum,
  payload: Record<string, unknown>,
  retryCount = 0
) {
  return OutboxEvent.reconstitute({
    id: Uuid.generate(),
    type,
    payload,
    status: OutboxEventStatusEnum.PENDING,
    retryCount,
    error: null,
    createdAt: new Date(),
    scheduledFor: null,
    processedAt: null,
    movieId: null
  });
}

describe("ProcessOutboxEvents", () => {
  const mockRepos = {
    outboxEventRepository: {
      findPendingBatch: vi.fn(),
      update: vi.fn()
    }
  };
  const transactionManager = {
    execute: vi.fn((fn: any) => fn(mockRepos))
  };
  const notificationService = {
    sendPasswordResetEmail: vi.fn(),
    sendMovieReleaseDateEmail: vi.fn(),
    sendWelcomeEmail: vi.fn()
  };
  const storageProvider = {
    generateUploadUrl: vi.fn(),
    deleteFile: vi.fn()
  };
  const config = { batchSize: 10, maxRetries: 3 };

  const useCase = new ProcessOutboxEvents(
    transactionManager as any,
    notificationService,
    storageProvider as any,
    config
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("processes WELCOME_EMAIL event", async () => {
    const event = makeEvent(OutboxEventTypeEnum.WELCOME_EMAIL, {
      to: "test@example.com"
    });
    mockRepos.outboxEventRepository.findPendingBatch.mockResolvedValue([event]);
    mockRepos.outboxEventRepository.update.mockResolvedValue(null);
    notificationService.sendWelcomeEmail.mockResolvedValue(undefined);

    await useCase.execute();

    expect(notificationService.sendWelcomeEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      idempotencyKey: event.id.toString()
    });
  });

  it("processes PASSWORD_RESET_EMAIL event", async () => {
    const event = makeEvent(OutboxEventTypeEnum.PASSWORD_RESET_EMAIL, {
      to: "test@example.com",
      token: "reset-token"
    });
    mockRepos.outboxEventRepository.findPendingBatch.mockResolvedValue([event]);
    mockRepos.outboxEventRepository.update.mockResolvedValue(null);
    notificationService.sendPasswordResetEmail.mockResolvedValue(undefined);

    await useCase.execute();

    expect(notificationService.sendPasswordResetEmail).toHaveBeenCalled();
  });

  it("processes MOVIE_RELEASE_DATE event", async () => {
    const event = makeEvent(OutboxEventTypeEnum.MOVIE_RELEASE_DATE, {
      to: "test@example.com",
      movieTitle: "Test",
      releaseDate: "2024-06-01"
    });
    mockRepos.outboxEventRepository.findPendingBatch.mockResolvedValue([event]);
    mockRepos.outboxEventRepository.update.mockResolvedValue(null);
    notificationService.sendMovieReleaseDateEmail.mockResolvedValue(undefined);

    await useCase.execute();

    expect(notificationService.sendMovieReleaseDateEmail).toHaveBeenCalled();
  });

  it("processes STORAGE_FILE_DELETE event", async () => {
    const event = makeEvent(OutboxEventTypeEnum.STORAGE_FILE_DELETE, {
      key: "uploads/user/file.jpg"
    });
    mockRepos.outboxEventRepository.findPendingBatch.mockResolvedValue([event]);
    mockRepos.outboxEventRepository.update.mockResolvedValue(null);
    storageProvider.deleteFile.mockResolvedValue(undefined);

    await useCase.execute();

    expect(storageProvider.deleteFile).toHaveBeenCalledWith(
      "uploads/user/file.jpg"
    );
  });

  it("records failure when dispatch fails and retries remain", async () => {
    const event = makeEvent(
      OutboxEventTypeEnum.WELCOME_EMAIL,
      { to: "test@example.com" },
      0
    );
    mockRepos.outboxEventRepository.findPendingBatch.mockResolvedValue([event]);
    notificationService.sendWelcomeEmail.mockRejectedValue(
      new Error("send failed")
    );
    mockRepos.outboxEventRepository.update.mockResolvedValue(null);

    await useCase.execute();

    const updateCall = mockRepos.outboxEventRepository.update.mock.calls[0][0];
    expect(updateCall.status).toBe(OutboxEventStatusEnum.PENDING);
    expect(updateCall.retryCount).toBe(1);
  });

  it("marks as failed when max retries exceeded", async () => {
    const event = makeEvent(
      OutboxEventTypeEnum.WELCOME_EMAIL,
      { to: "test@example.com" },
      2
    );
    mockRepos.outboxEventRepository.findPendingBatch.mockResolvedValue([event]);
    notificationService.sendWelcomeEmail.mockRejectedValue(
      new Error("send failed")
    );
    mockRepos.outboxEventRepository.update.mockResolvedValue(null);

    await useCase.execute();

    const updateCall = mockRepos.outboxEventRepository.update.mock.calls[0][0];
    expect(updateCall.status).toBe(OutboxEventStatusEnum.FAILED);
    expect(updateCall.retryCount).toBe(3);
  });

  it("does nothing when no pending events", async () => {
    mockRepos.outboxEventRepository.findPendingBatch.mockResolvedValue([]);

    await useCase.execute();

    expect(notificationService.sendWelcomeEmail).not.toHaveBeenCalled();
    expect(storageProvider.deleteFile).not.toHaveBeenCalled();
  });
});
