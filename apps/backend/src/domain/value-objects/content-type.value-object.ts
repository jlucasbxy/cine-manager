import z from "zod";
import { InvalidContentTypeError } from "@/domain/errors";
import { ContentTypeEnum } from "@/domain/enums/content-type.enum";

const contentTypeValues = Object.values(ContentTypeEnum) as [
  ContentTypeEnum,
  ...ContentTypeEnum[]
];

export class ContentType {
  private readonly value: ContentTypeEnum;

  private constructor(value: ContentTypeEnum) {
    this.value = value;
  }

  static create(value: string): ContentType {
    const r = z.enum(contentTypeValues).safeParse(value);
    if (!r.success) {
      throw new InvalidContentTypeError();
    }
    return new ContentType(value as ContentTypeEnum);
  }

  public getValue(): ContentTypeEnum {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
