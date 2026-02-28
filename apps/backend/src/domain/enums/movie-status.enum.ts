export const MovieStatusEnum = {
  RELEASED: "RELEASED",
  POST_PRODUCTION: "POST_PRODUCTION",
  IN_PRODUCTION: "IN_PRODUCTION",
  PLANNED: "PLANNED",
  CANCELED: "CANCELED",
  RUMORED: "RUMORED"
} as const;

export type MovieStatusEnum =
  (typeof MovieStatusEnum)[keyof typeof MovieStatusEnum];
