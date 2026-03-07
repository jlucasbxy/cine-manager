import { ErrorCode } from "@repo/dtos";
import z from "zod";

const rateLimitEnvSchema = z.object({
  RATE_LIMIT_LOGIN_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_LOGIN_WINDOW: z.string().default("1 minute"),
  RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX: z.coerce
    .number()
    .int()
    .positive()
    .default(3),
  RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW: z.string().default("1 minute"),
  RATE_LIMIT_PASSWORD_RESET_EXECUTE_MAX: z.coerce
    .number()
    .int()
    .positive()
    .default(5),
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

const rateLimitEnv = rateLimitEnvSchema.parse(process.env);

export const RATE_LIMITS = {
  login: {
    max: rateLimitEnv.RATE_LIMIT_LOGIN_MAX,
    timeWindow: rateLimitEnv.RATE_LIMIT_LOGIN_WINDOW
  },
  passwordResetRequest: {
    max: rateLimitEnv.RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX,
    timeWindow: rateLimitEnv.RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW
  },
  passwordResetExecute: {
    max: rateLimitEnv.RATE_LIMIT_PASSWORD_RESET_EXECUTE_MAX,
    timeWindow: rateLimitEnv.RATE_LIMIT_PASSWORD_RESET_EXECUTE_WINDOW
  },
  refresh: {
    max: rateLimitEnv.RATE_LIMIT_REFRESH_MAX,
    timeWindow: rateLimitEnv.RATE_LIMIT_REFRESH_WINDOW
  },
  logout: {
    max: rateLimitEnv.RATE_LIMIT_LOGOUT_MAX,
    timeWindow: rateLimitEnv.RATE_LIMIT_LOGOUT_WINDOW
  },
  registration: {
    max: rateLimitEnv.RATE_LIMIT_REGISTRATION_MAX,
    timeWindow: rateLimitEnv.RATE_LIMIT_REGISTRATION_WINDOW
  },
  uploadUrl: {
    max: rateLimitEnv.RATE_LIMIT_UPLOAD_URL_MAX,
    timeWindow: rateLimitEnv.RATE_LIMIT_UPLOAD_URL_WINDOW,
    errorResponseBuilder: (_request: unknown, context: { after: string }) => ({
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message: `Image upload limit reached. You can only upload ${rateLimitEnv.RATE_LIMIT_UPLOAD_URL_MAX} images per day. Please try again in ${context.after}.`
    })
  }
};
