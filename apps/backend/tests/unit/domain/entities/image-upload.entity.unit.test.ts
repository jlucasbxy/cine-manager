import { ImageUpload } from "@/domain/entities/image-upload.entity";
import { ImageMimeTypeEnum } from "@/domain/enums/image-mime-type.enum";
import { ImageMimeType, UploadKey, Url, Uuid } from "@/domain/value-objects";

describe("ImageUpload", () => {
  describe("create", () => {
    it("sets key, contentType from uploadKey, uploadUrl, and fileUrl", () => {
      const userId = Uuid.generate();
      const mimeType = ImageMimeType.create(ImageMimeTypeEnum.PNG);
      const uploadKey = UploadKey.create({ userId, mimeType });
      const uploadUrl = Url.create("https://s3.example.com/upload");
      const fileUrl = Url.create("https://cdn.example.com/file.png");

      const upload = ImageUpload.create({ uploadKey, uploadUrl, fileUrl });

      expect(upload.key).toBe(uploadKey);
      expect(upload.contentType.getValue()).toBe(ImageMimeTypeEnum.PNG);
      expect(upload.uploadUrl.toString()).toBe("https://s3.example.com/upload");
      expect(upload.fileUrl.toString()).toBe(
        "https://cdn.example.com/file.png"
      );
    });
  });
});
