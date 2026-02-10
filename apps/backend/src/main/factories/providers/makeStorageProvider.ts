import { S3StorageProvider } from "@/infrastructure/providers";
import { singleton } from "@/main/factories/singleton";

export const makeStorageProvider = singleton(() => new S3StorageProvider());
