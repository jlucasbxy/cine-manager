import { S3Client } from "@aws-sdk/client-s3";
import { s3Env } from "../../../infrastructure/config/s3-env.config";
import { singleton } from "../singleton.util";

export const makeS3Client = singleton(
  () =>
    new S3Client({
      region: s3Env.S3_REGION,
      ...(s3Env.S3_ENDPOINT && { endpoint: s3Env.S3_ENDPOINT }),
      credentials: {
        accessKeyId: s3Env.S3_ACCESS_KEY_ID,
        secretAccessKey: s3Env.S3_SECRET_ACCESS_KEY
      },
      forcePathStyle: s3Env.S3_FORCE_PATH_STYLE
    })
);
