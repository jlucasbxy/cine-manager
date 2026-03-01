import { ImageUploadMapper } from "@/application/mappers/image-upload.mapper";
import { ImageUpload } from "@/domain/entities/image-upload.entity";
import { ImageMimeTypeEnum } from "@/domain/enums/image-mime-type.enum";
import { ImageMimeType, UploadKey, Url, Uuid } from "@/domain/value-objects";

describe("ImageUploadMapper", () => {
  describe("toDTO", () => {
    it("maps image upload entity to DTO", () => {
      const userId = Uuid.generate();
      const mimeType = ImageMimeType.create(ImageMimeTypeEnum.JPEG);
      const uploadKey = UploadKey.create({ userId, mimeType });
      const uploadUrl = Url.create("https://s3.example.com/upload");
      const fileUrl = Url.create("https://cdn.example.com/file.jpg");

      const upload = ImageUpload.create({ uploadKey, uploadUrl, fileUrl });
      const dto = ImageUploadMapper.toDTO(upload);

      expect(dto.uploadUrl).toBe("https://s3.example.com/upload");
      expect(dto.fileUrl).toBe("https://cdn.example.com/file.jpg");
      expect(dto.key).toBe(uploadKey.toString());
    });
  });
});
