import type { EmailProvider } from "@/application/interfaces/providers";
import type { SendMovieReleaseDateEmailData } from "@/application/interfaces/services";

export class SendMovieReleaseDateEmail {
  constructor(private readonly emailProvider: EmailProvider) {}

  async execute({
    to,
    movieTitle,
    releaseDate,
    idempotencyKey
  }: SendMovieReleaseDateEmailData): Promise<void> {
    const formattedDate = new Date(releaseDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    await this.emailProvider.send({
      to,
      subject: `${movieTitle} is out today!`,
      body: `<p>The movie <strong>${movieTitle}</strong> you added has been released on ${formattedDate}. Enjoy!</p>`,
      idempotencyKey
    });
  }
}
