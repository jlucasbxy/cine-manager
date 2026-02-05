import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  PASSWORD_RESET_TOKEN_EXPIRES_IN: z.string().default("1h"),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string()
});

export const env = envSchema.parse(process.env);
