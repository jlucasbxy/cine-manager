import { NotificationServiceImpl } from "@/infrastructure/services";
import {
  makeSendPasswordResetEmail,
  makeSendMovieReleaseDateEmail
} from "@/main/factories/use-cases/notification";
import { singleton } from "@/main/factories/singleton.util";

export const makeNotificationService = singleton(
  () =>
    new NotificationServiceImpl(
      makeSendPasswordResetEmail(),
      makeSendMovieReleaseDateEmail()
    )
);
