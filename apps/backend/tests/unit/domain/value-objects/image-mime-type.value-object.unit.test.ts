import { ImageMimeType } from "@/domain/value-objects/image-mime-type.value-object";
import { ImageMimeTypeEnum } from "@/domain/enums/image-mime-type.enum";
import { InvalidImageMimeTypeError } from "@/domain/errors";

describe("ImageMimeType", () => {
  it("creates with valid JPEG mime type", () => {
    const mime = ImageMimeType.create(ImageMimeTypeEnum.JPEG);
    expect(mime.getValue()).toBe(ImageMimeTypeEnum.JPEG);
    expect(mime.toString()).toBe("image/jpeg");
  });

  it("creates with valid PNG mime type", () => {
    const mime = ImageMimeType.create(ImageMimeTypeEnum.PNG);
    expect(mime.getValue()).toBe(ImageMimeTypeEnum.PNG);
  });

  it("creates with valid WEBP mime type", () => {
    const mime = ImageMimeType.create(ImageMimeTypeEnum.WEBP);
    expect(mime.getValue()).toBe(ImageMimeTypeEnum.WEBP);
  });

  it("throws for invalid mime type", () => {
    expect(() => ImageMimeType.create("image/gif")).toThrow(
      InvalidImageMimeTypeError
    );
  });

  it("creates from .jpg filename", () => {
    const mime = ImageMimeType.fromFilename("photo.jpg");
    expect(mime.getValue()).toBe(ImageMimeTypeEnum.JPEG);
  });

  it("creates from .jpeg filename", () => {
    const mime = ImageMimeType.fromFilename("photo.jpeg");
    expect(mime.getValue()).toBe(ImageMimeTypeEnum.JPEG);
  });

  it("creates from .png filename", () => {
    const mime = ImageMimeType.fromFilename("photo.png");
    expect(mime.getValue()).toBe(ImageMimeTypeEnum.PNG);
  });

  it("creates from .webp filename", () => {
    const mime = ImageMimeType.fromFilename("photo.webp");
    expect(mime.getValue()).toBe(ImageMimeTypeEnum.WEBP);
  });

  it("throws for unsupported extension", () => {
    expect(() => ImageMimeType.fromFilename("photo.gif")).toThrow(
      InvalidImageMimeTypeError
    );
  });

  it("handles case-insensitive extensions", () => {
    const mime = ImageMimeType.fromFilename("photo.PNG");
    expect(mime.getValue()).toBe(ImageMimeTypeEnum.PNG);
  });
});
