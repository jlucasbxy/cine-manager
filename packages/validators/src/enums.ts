export const AgeRating = {
  L: "L",
  TEN: "TEN",
  TWELVE: "TWELVE",
  FOURTEEN: "FOURTEEN",
  SIXTEEN: "SIXTEEN",
  EIGHTEEN: "EIGHTEEN"
} as const

export type AgeRating = (typeof AgeRating)[keyof typeof AgeRating]

export const MovieStatus = {
  RELEASED: "RELEASED",
  POST_PRODUCTION: "POST_PRODUCTION",
  IN_PRODUCTION: "IN_PRODUCTION",
  PLANNED: "PLANNED",
  CANCELED: "CANCELED",
  RUMORED: "RUMORED"
} as const

export type MovieStatus = (typeof MovieStatus)[keyof typeof MovieStatus]
