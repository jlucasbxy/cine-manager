import path from "node:path";
import { uuidv7 } from "uuidv7";
import type { StorageProvider } from "@/application/interfaces/providers";
import type {
  GenerateUploadUrlDTO,
  GenerateUploadUrlResultDTO
} from "@repo/dtos";

export class GenerateUploadUrl {
  constructor(
    private readonly storageProvider: StorageProvider,
    private readonly uploadUrlExpiresIn: number
  ) {}

  async execute(
    userId: string,
    input: GenerateUploadUrlDTO
  ): Promise<GenerateUploadUrlResultDTO> {
    const ext = path.extname(input.fileName);
    const key = `uploads/${userId}/${uuidv7()}${ext}`;

    const { uploadUrl, fileUrl } =
      await this.storageProvider.generateUploadUrl({
        key,
        contentType: input.contentType,
        expiresInSeconds: this.uploadUrlExpiresIn
      });

    return { uploadUrl, fileUrl, key };
  }
}
