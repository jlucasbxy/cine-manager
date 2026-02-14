export type SendPasswordResetEmailData = {
  to: string;
  token: string;
  idempotencyKey: string;
};

export interface NotificationService {
  sendPasswordResetEmail(data: SendPasswordResetEmailData): Promise<void>;
}
