import { SendPasswordResetEmail } from "@/application/use-cases/notification";
import { makeEmailProvider } from "@/main/factories/providers";

export function makeSendPasswordResetEmail(): SendPasswordResetEmail {
  return new SendPasswordResetEmail(makeEmailProvider());
}
