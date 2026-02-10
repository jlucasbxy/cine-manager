import type { ImageUpload } from "@/domain/entities";

export type GenerateUploadUrlResult = {
  uploadUrl: string;
  fileUrl: string;
};

export interface StorageProvider {
  generateUploadUrl(upload: ImageUpload): Promise<GenerateUploadUrlResult>;
}
