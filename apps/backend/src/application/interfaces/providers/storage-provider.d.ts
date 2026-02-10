import type { Upload } from "@/domain/entities";

export type GenerateUploadUrlResult = {
  uploadUrl: string;
  fileUrl: string;
};

export interface StorageProvider {
  generateUploadUrl(upload: Upload): Promise<GenerateUploadUrlResult>;
}
