import { ErrorCode } from "@repo/dtos";

export const RATE_LIMITS = {
  login: { max: 5, timeWindow: "1 minute" },
  passwordResetRequest: { max: 3, timeWindow: "1 minute" },
  passwordResetExecute: { max: 5, timeWindow: "1 minute" },
  refresh: { max: 10, timeWindow: "1 minute" },
  logout: { max: 10, timeWindow: "1 minute" },
  registration: { max: 10, timeWindow: "1 minute" },
  uploadUrl: {
    max: 10,
    timeWindow: "1 day",
    errorResponseBuilder: (_request: unknown, context: { after: string }) => ({
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message: `Image upload limit reached. You can only upload 10 images per day. Please try again in ${context.after}.`
    })
  }
} as const;
