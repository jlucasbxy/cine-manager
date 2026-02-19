import { SendWelcomeEmail } from "@/application/use-cases/notification";
import { makeEmailProvider } from "@/main/factories/providers";

export function makeSendWelcomeEmail(): SendWelcomeEmail {
  return new SendWelcomeEmail(makeEmailProvider());
}
