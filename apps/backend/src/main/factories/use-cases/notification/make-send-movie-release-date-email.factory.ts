import { SendMovieReleaseDateEmail } from "@/application/use-cases/notification";
import { makeEmailProvider } from "@/main/factories/providers";

export function makeSendMovieReleaseDateEmail(): SendMovieReleaseDateEmail {
  return new SendMovieReleaseDateEmail(makeEmailProvider());
}
