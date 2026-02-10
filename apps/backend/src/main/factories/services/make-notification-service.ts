import { NotificationServiceImpl } from "@/infrastructure/services";
import { makeSendPasswordResetEmail } from "@/main/factories/use-cases/notification";
import { singleton } from "@/main/factories/singleton";

export const makeNotificationService = singleton(
  () => new NotificationServiceImpl(makeSendPasswordResetEmail())
);
