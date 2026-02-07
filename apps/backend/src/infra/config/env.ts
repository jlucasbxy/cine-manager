import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  PASSWORD_RESET_TOKEN_EXPIRES_IN: z.string().default("1h"),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  NOTIFICATION_OUTBOX_POLL_INTERVAL_MS: z.coerce.number().default(5000),
  NOTIFICATION_OUTBOX_BATCH_SIZE: z.coerce.number().default(10),
  NOTIFICATION_OUTBOX_MAX_RETRIES: z.coerce.number().default(3)
});

export const env = envSchema.parse(process.env);
