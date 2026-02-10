import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  StorageProvider,
  GenerateUploadUrlData,
  GenerateUploadUrlResult
} from "@/application/interfaces/providers";
import { env } from "@/infrastructure/config/env";

export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: env.S3_REGION,
      ...(env.S3_ENDPOINT && { endpoint: env.S3_ENDPOINT }),
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY
      },
      forcePathStyle: env.S3_FORCE_PATH_STYLE
    });
  }

  async generateUploadUrl(
    data: GenerateUploadUrlData
  ): Promise<GenerateUploadUrlResult> {
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: data.key,
      ContentType: data.contentType
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: data.expiresInSeconds
    });

    const fileUrl = env.S3_FORCE_PATH_STYLE
      ? `${env.S3_ENDPOINT}/${env.S3_BUCKET}/${data.key}`
      : `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${data.key}`;

    return { uploadUrl, fileUrl };
  }
}
