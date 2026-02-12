import "dotenv/config";
import ms from "ms";
import z from "zod";

const durationString = z
  .string()
  .refine((value) => ms(value as ms.StringValue) !== undefined, {
    message: 'Must be a valid duration string (e.g. "15m", "7d", "1h", "30s")'
  });

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: durationString.default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: durationString.default("7d"),
  PASSWORD_RESET_TOKEN_EXPIRES_IN: durationString.default("1h"),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  REDIS_URL: z.string().default("redis://localhost:6379")
});

export const env = envSchema.parse(process.env);
