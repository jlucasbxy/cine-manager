import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  StorageProvider,
  GenerateUploadUrlData,
  GenerateUploadUrlResult
} from "@/application/interfaces/providers";
import { s3Env } from "@/infrastructure/config/s3-env";

export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: s3Env.S3_REGION,
      ...(s3Env.S3_ENDPOINT && { endpoint: s3Env.S3_ENDPOINT }),
      credentials: {
        accessKeyId: s3Env.S3_ACCESS_KEY_ID,
        secretAccessKey: s3Env.S3_SECRET_ACCESS_KEY
      },
      forcePathStyle: s3Env.S3_FORCE_PATH_STYLE
    });
  }

  async generateUploadUrl(
    data: GenerateUploadUrlData
  ): Promise<GenerateUploadUrlResult> {
    const command = new PutObjectCommand({
      Bucket: s3Env.S3_BUCKET,
      Key: data.key,
      ContentType: data.contentType
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: data.expiresInSeconds
    });

    const fileUrl = s3Env.S3_FORCE_PATH_STYLE
      ? `${s3Env.S3_ENDPOINT}/${s3Env.S3_BUCKET}/${data.key}`
      : `https://${s3Env.S3_BUCKET}.s3.${s3Env.S3_REGION}.amazonaws.com/${data.key}`;

    return { uploadUrl, fileUrl };
  }
}
