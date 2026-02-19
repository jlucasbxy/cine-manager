export type SendPasswordResetEmailData = {
  to: string;
  token: string;
  idempotencyKey: string;
};

export type SendMovieReleaseDateEmailData = {
  to: string;
  movieTitle: string;
  releaseDate: string;
  idempotencyKey: string;
};

export interface NotificationService {
  sendPasswordResetEmail(data: SendPasswordResetEmailData): Promise<void>;
  sendMovieReleaseDateEmail(data: SendMovieReleaseDateEmailData): Promise<void>;
}
