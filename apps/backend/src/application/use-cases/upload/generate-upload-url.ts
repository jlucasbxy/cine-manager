import type { StorageProvider } from "@/application/interfaces/providers";
import type {
  GenerateUploadUrlDTO,
  GenerateUploadUrlResultDTO
} from "@repo/dtos";
import { Upload } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects";

export class GenerateUploadUrl {
  constructor(private readonly storageProvider: StorageProvider) {}

  async execute(
    userId: string,
    input: GenerateUploadUrlDTO
  ): Promise<GenerateUploadUrlResultDTO> {
    const upload = Upload.create({
      fileName: input.fileName,
      contentType: input.contentType,
      userId: Uuid.create(userId)
    });

    const { uploadUrl, fileUrl } =
      await this.storageProvider.generateUploadUrl(upload);

    return { uploadUrl, fileUrl, key: upload.key };
  }
}
