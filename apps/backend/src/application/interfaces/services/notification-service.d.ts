export type SendPasswordResetEmailData = {
  to: string;
  token: string;
};

export interface NotificationService {
  sendPasswordResetEmail(data: SendPasswordResetEmailData): Promise<void>;
}
