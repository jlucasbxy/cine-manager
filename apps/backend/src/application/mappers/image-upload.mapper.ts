import type { GenerateUploadUrlResultDTO } from "@repo/dtos";
import type { ImageUpload } from "@/domain/entities";

export const ImageUploadMapper = {
  toDTO(imageUpload: ImageUpload): GenerateUploadUrlResultDTO {
    return {
      uploadUrl: imageUpload.uploadUrl.toString(),
      fileUrl: imageUpload.fileUrl.toString(),
      key: imageUpload.key.toString()
    };
  }
};
