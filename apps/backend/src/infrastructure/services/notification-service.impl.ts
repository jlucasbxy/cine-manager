import type {
  NotificationService,
  SendMovieReleaseDateEmailData,
  SendPasswordResetEmailData,
  SendWelcomeEmailData
} from "@/application/interfaces/services";
import type {
  SendMovieReleaseDateEmail,
  SendPasswordResetEmail,
  SendWelcomeEmail
} from "@/application/use-cases/notification";

export class NotificationServiceImpl implements NotificationService {
  constructor(
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmail,
    private readonly sendMovieReleaseDateEmailUseCase: SendMovieReleaseDateEmail,
    private readonly sendWelcomeEmailUseCase: SendWelcomeEmail
  ) {}

  async sendPasswordResetEmail(
    data: SendPasswordResetEmailData
  ): Promise<void> {
    return this.sendPasswordResetEmailUseCase.execute(data);
  }

  async sendMovieReleaseDateEmail(
    data: SendMovieReleaseDateEmailData
  ): Promise<void> {
    return this.sendMovieReleaseDateEmailUseCase.execute(data);
  }

  async sendWelcomeEmail(data: SendWelcomeEmailData): Promise<void> {
    return this.sendWelcomeEmailUseCase.execute(data);
  }
}
