import { NotificationServiceImpl } from "@/infrastructure/services";
import { singleton } from "@/main/factories/singleton.util";
import {
  makeSendMovieReleaseDateEmail,
  makeSendPasswordResetEmail,
  makeSendWelcomeEmail
} from "@/main/factories/use-cases/notification";

export const makeNotificationService = singleton(
  () =>
    new NotificationServiceImpl(
      makeSendPasswordResetEmail(),
      makeSendMovieReleaseDateEmail(),
      makeSendWelcomeEmail()
    )
);
