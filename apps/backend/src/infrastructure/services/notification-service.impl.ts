import type {
  NotificationService,
  SendPasswordResetEmailData
} from "@/application/interfaces/services";
import type { SendPasswordResetEmail } from "@/application/use-cases/notification";

export class NotificationServiceImpl implements NotificationService {
  constructor(
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmail
  ) { }

  async sendPasswordResetEmail(
    data: SendPasswordResetEmailData
  ): Promise<void> {
    return this.sendPasswordResetEmailUseCase.execute(data);
  }
}
