import type {
  GenerateUploadUrlDTO,
  GenerateUploadUrlResultDTO
} from "@repo/dtos";

export interface UploadService {
  generateUploadUrl(
    userId: string,
    input: GenerateUploadUrlDTO
  ): Promise<GenerateUploadUrlResultDTO>;
}
