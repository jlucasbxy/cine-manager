export const RATE_LIMITS = {
  login: { max: 5, timeWindow: "1 minute" },
  passwordResetRequest: { max: 3, timeWindow: "1 minute" },
  registration: { max: 10, timeWindow: "1 minute" },
  uploadUrl: { max: 10, timeWindow: "1 day" }
} as const;
