import { SendMovieReleaseDateEmail } from "@/application/use-cases/notification/send-movie-release-date-email.use-case";

describe("SendMovieReleaseDateEmail", () => {
  const emailProvider = { send: vi.fn() };
  const useCase = new SendMovieReleaseDateEmail(emailProvider as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends movie release date email", async () => {
    emailProvider.send.mockResolvedValue(undefined);

    await useCase.execute({
      to: "test@example.com",
      movieTitle: "Inception 2",
      releaseDate: "2024-06-15T00:00:00.000Z",
      idempotencyKey: "key-789"
    });

    expect(emailProvider.send).toHaveBeenCalledWith({
      to: "test@example.com",
      subject: "Inception 2 is out today!",
      body: expect.stringContaining("Inception 2"),
      idempotencyKey: "key-789"
    });
  });
});
