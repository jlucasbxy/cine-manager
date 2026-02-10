import { NotificationServiceImpl } from "@/infrastructure/services";
import { makeSendPasswordResetEmail } from "@/main/factories/use-cases/notification";

export function makeNotificationService(): NotificationServiceImpl {
  return new NotificationServiceImpl(makeSendPasswordResetEmail());
}
