import z from "zod";
import { InvalidImageMimeTypeError } from "@/domain/errors";
import { ImageMimeTypeEnum } from "@/domain/enums/image-mime-type.enum";

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

  public getValue(): ImageMimeTypeEnum {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
