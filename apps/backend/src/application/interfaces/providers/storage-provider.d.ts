import { UploadKey } from "@/domain/value-objects";

export type GenerateUploadUrlResult = {
  uploadUrl: string;
  fileUrl: string;
};

export interface StorageProvider {
  generateUploadUrl(uploadKey: UploadKey): Promise<GenerateUploadUrlResult>;
}
