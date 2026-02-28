export const ImageMimeTypeEnum = {
  JPEG: "image/jpeg",
  PNG: "image/png",
  WEBP: "image/webp"
} as const;

export type ImageMimeTypeEnum =
  (typeof ImageMimeTypeEnum)[keyof typeof ImageMimeTypeEnum];
