import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  StorageProvider,
  GenerateUploadUrlResult
} from "@/application/interfaces/providers";
import type { Upload } from "@/domain/entities";
import { s3Env } from "@/infrastructure/config/s3-env";

export class S3StorageProvider implements StorageProvider {

  constructor(private readonly client: S3Client) { }

  async generateUploadUrl(upload: Upload): Promise<GenerateUploadUrlResult> {
    const command = new PutObjectCommand({
      Bucket: s3Env.S3_BUCKET,
      Key: upload.key,
      ContentType: upload.contentType
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: s3Env.UPLOAD_URL_EXPIRES_IN
    });

    const fileUrl = s3Env.S3_FORCE_PATH_STYLE
      ? `${s3Env.S3_ENDPOINT}/${s3Env.S3_BUCKET}/${upload.key}`
      : `https://${s3Env.S3_BUCKET}.s3.${s3Env.S3_REGION}.amazonaws.com/${upload.key}`;

    return { uploadUrl, fileUrl };
  }
}
