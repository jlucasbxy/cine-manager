import type {
  NotificationService,
  SendPasswordResetEmailData,
  SendMovieReleaseDateEmailData
} from "@/application/interfaces/services";
import type {
  SendPasswordResetEmail,
  SendMovieReleaseDateEmail
} from "@/application/use-cases/notification";

export class NotificationServiceImpl implements NotificationService {
  constructor(
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmail,
    private readonly sendMovieReleaseDateEmailUseCase: SendMovieReleaseDateEmail
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
}
