import type { StorageProvider } from "@/application/interfaces/providers";
import type {
  GenerateUploadUrlDTO,
  GenerateUploadUrlResultDTO
} from "@repo/dtos";
import { ImageMimeType, UploadKey, Uuid } from "@/domain/value-objects";

export class GenerateUploadUrl {
  constructor(private readonly storageProvider: StorageProvider) {}

  async execute(
    userId: string,
    input: GenerateUploadUrlDTO
  ): Promise<GenerateUploadUrlResultDTO> {
    const uploadKey = UploadKey.create({
      mimeType: ImageMimeType.create(input.contentType),
      userId: Uuid.create(userId)
    });

    const { uploadUrl, fileUrl } =
      await this.storageProvider.generateUploadUrl(uploadKey);

    return { uploadUrl, fileUrl, key: uploadKey.toString() };
  }
}
