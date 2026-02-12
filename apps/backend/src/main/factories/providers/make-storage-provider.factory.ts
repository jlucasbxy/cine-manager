import { S3StorageProvider } from "@/infrastructure/providers";
import { s3Env } from "@/infrastructure/config/s3-env.config";
import { singleton } from "@/main/factories/singleton.util";
import { makeS3Client } from "@/main/factories/s3";

export const makeStorageProvider = singleton(
  () =>
    new S3StorageProvider(makeS3Client(), {
      bucket: s3Env.S3_BUCKET,
      region: s3Env.S3_REGION,
      endpoint: s3Env.S3_ENDPOINT,
      forcePathStyle: s3Env.S3_FORCE_PATH_STYLE,
      uploadUrlExpiresIn: s3Env.UPLOAD_URL_EXPIRES_IN
    })
);
