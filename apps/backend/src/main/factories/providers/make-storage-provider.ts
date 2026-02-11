import { S3StorageProvider } from "@/infrastructure/providers";
import { singleton } from "@/main/factories/singleton";
import { makeS3Client } from "@/main/factories/s3";

export const makeStorageProvider = singleton(
  () => new S3StorageProvider(makeS3Client())
);
