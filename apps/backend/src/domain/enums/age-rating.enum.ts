export const AgeRatingEnum = {
  L: "L",
  TEN: "TEN",
  TWELVE: "TWELVE",
  FOURTEEN: "FOURTEEN",
  SIXTEEN: "SIXTEEN",
  EIGHTEEN: "EIGHTEEN"
} as const;

export type AgeRatingEnum =
  (typeof AgeRatingEnum)[keyof typeof AgeRatingEnum];
