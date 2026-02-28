import type { ImageUpload } from "@/domain/entities";
import type { UploadKey } from "@/domain/value-objects";

export interface StorageProvider {
  generateUploadUrl(uploadKey: UploadKey): Promise<ImageUpload>;
  deleteFile(key: string): Promise<void>;
}
