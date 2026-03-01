import { ErrorCode } from "@repo/dtos";
import { env } from "./env.config";

export const RATE_LIMITS = {
  login: {
    max: env.RATE_LIMIT_LOGIN_MAX,
    timeWindow: env.RATE_LIMIT_LOGIN_WINDOW
  },
  passwordResetRequest: {
    max: env.RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX,
    timeWindow: env.RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW
  },
  passwordResetExecute: {
    max: env.RATE_LIMIT_PASSWORD_RESET_EXECUTE_MAX,
    timeWindow: env.RATE_LIMIT_PASSWORD_RESET_EXECUTE_WINDOW
  },
  refresh: {
    max: env.RATE_LIMIT_REFRESH_MAX,
    timeWindow: env.RATE_LIMIT_REFRESH_WINDOW
  },
  logout: {
    max: env.RATE_LIMIT_LOGOUT_MAX,
    timeWindow: env.RATE_LIMIT_LOGOUT_WINDOW
  },
  registration: {
    max: env.RATE_LIMIT_REGISTRATION_MAX,
    timeWindow: env.RATE_LIMIT_REGISTRATION_WINDOW
  },
  uploadUrl: {
    max: env.RATE_LIMIT_UPLOAD_URL_MAX,
    timeWindow: env.RATE_LIMIT_UPLOAD_URL_WINDOW,
    errorResponseBuilder: (_request: unknown, context: { after: string }) => ({
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message: `Image upload limit reached. You can only upload ${env.RATE_LIMIT_UPLOAD_URL_MAX} images per day. Please try again in ${context.after}.`
    })
  }
};
