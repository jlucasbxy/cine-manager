import path from "node:path";
import z from "zod";
import { ImageMimeTypeEnum } from "@/domain/enums/image-mime-type.enum";
import { InvalidImageMimeTypeError } from "@/domain/errors";

const extensionToMimeType: Record<string, ImageMimeTypeEnum> = {
  ".jpg": ImageMimeTypeEnum.JPEG,
  ".jpeg": ImageMimeTypeEnum.JPEG,
  ".png": ImageMimeTypeEnum.PNG,
  ".webp": ImageMimeTypeEnum.WEBP
};

const imageMimeTypeValues = Object.values(ImageMimeTypeEnum) as [
  ImageMimeTypeEnum,
  ...ImageMimeTypeEnum[]
];

export class ImageMimeType {
  private readonly value: ImageMimeTypeEnum;

  private constructor(value: ImageMimeTypeEnum) {
    this.value = value;
  }

  static create(value: string): ImageMimeType {
    const r = z.enum(imageMimeTypeValues).safeParse(value);
    if (!r.success) {
      throw new InvalidImageMimeTypeError();
    }
    return new ImageMimeType(value as ImageMimeTypeEnum);
  }

  static fromFilename(filename: string): ImageMimeType {
    const ext = path.extname(filename).toLowerCase();
    const mimeType = extensionToMimeType[ext];
    if (!mimeType) {
      throw new InvalidImageMimeTypeError();
    }
    return new ImageMimeType(mimeType);
  }

  public getValue(): ImageMimeTypeEnum {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
