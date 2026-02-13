export type SendPasswordResetEmailData = {
  to: string;
  token: string;
};

export interface NotificationService {
  sendPasswordResetEmailBatch(
    data: SendPasswordResetEmailData[]
  ): Promise<void>;
}
