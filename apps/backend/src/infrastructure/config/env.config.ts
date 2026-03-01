import "dotenv/config";
import ms from "ms";
import z from "zod";

const NODE_ENV = z
  .enum(["development", "production", "test"])
  .default("production")
  .parse(process.env["NODE_ENV"]);

const durationString = z
  .string()
  .refine((value) => ms(value as ms.StringValue) !== undefined, {
    message: 'Must be a valid duration string (e.g. "15m", "7d", "1h", "30s")'
  });

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.ipv4().default("0.0.0.0"),
  DATABASE_URL: z.url(),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: durationString.default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: durationString.default("7d"),
  PASSWORD_RESET_TOKEN_EXPIRES_IN: durationString.default("1h"),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.email(),
  REDIS_URL: z.url(),
  FRONTEND_URL: z.url(),
  ENABLE_DOCS: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  RATE_LIMIT_LOGIN_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_LOGIN_WINDOW: z.string().default("1 minute"),
  RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX: z.coerce.number().int().positive().default(3),
  RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW: z.string().default("1 minute"),
  RATE_LIMIT_PASSWORD_RESET_EXECUTE_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_PASSWORD_RESET_EXECUTE_WINDOW: z.string().default("1 minute"),
  RATE_LIMIT_REFRESH_MAX: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_REFRESH_WINDOW: z.string().default("1 minute"),
  RATE_LIMIT_LOGOUT_MAX: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_LOGOUT_WINDOW: z.string().default("1 minute"),
  RATE_LIMIT_REGISTRATION_MAX: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_REGISTRATION_WINDOW: z.string().default("1 minute"),
  RATE_LIMIT_UPLOAD_URL_MAX: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_UPLOAD_URL_WINDOW: z.string().default("1 day")
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  ...parsedEnv,
  IS_DEVELOPMENT: NODE_ENV === "development",
  IS_PRODUCTION: NODE_ENV === "production",
  IS_TEST: NODE_ENV === "test"
};
