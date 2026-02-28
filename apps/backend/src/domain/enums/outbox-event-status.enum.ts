export const OutboxEventStatusEnum = {
  PENDING: "PENDING",
  PROCESSED: "PROCESSED",
  FAILED: "FAILED"
} as const;

export type OutboxEventStatusEnum =
  (typeof OutboxEventStatusEnum)[keyof typeof OutboxEventStatusEnum];
