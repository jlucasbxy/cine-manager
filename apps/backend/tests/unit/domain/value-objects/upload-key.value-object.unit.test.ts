import { ImageMimeTypeEnum } from "@/domain/enums/image-mime-type.enum";
import { ImageMimeType } from "@/domain/value-objects/image-mime-type.value-object";
import { UploadKey } from "@/domain/value-objects/upload-key.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

describe("UploadKey", () => {
  it("creates a key with correct format", () => {
    const userId = Uuid.generate();
    const mimeType = ImageMimeType.create(ImageMimeTypeEnum.JPEG);
    const key = UploadKey.create({ userId, mimeType });

    expect(key.toString()).toMatch(
      new RegExp(`^uploads/${userId.toString()}/[a-f0-9-]+image/jpeg$`)
    );
  });

  it("returns the correct mime type", () => {
    const userId = Uuid.generate();
    const mimeType = ImageMimeType.create(ImageMimeTypeEnum.PNG);
    const key = UploadKey.create({ userId, mimeType });

    expect(key.getMimeType().getValue()).toBe(ImageMimeTypeEnum.PNG);
  });

  it("reconstitute calls create", () => {
    const userId = Uuid.generate();
    const mimeType = ImageMimeType.create(ImageMimeTypeEnum.WEBP);
    const key = UploadKey.reconstitute({ userId, mimeType });

    expect(key.toString()).toContain("uploads/");
    expect(key.getMimeType().getValue()).toBe(ImageMimeTypeEnum.WEBP);
  });
});
