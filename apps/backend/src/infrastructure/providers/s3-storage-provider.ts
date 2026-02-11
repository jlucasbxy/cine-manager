import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  StorageProvider,
  GenerateUploadUrlResult
} from "@/application/interfaces/providers";
import { s3Env } from "@/infrastructure/config/s3-env";
import { UploadKey } from "@/domain/value-objects";

export class S3StorageProvider implements StorageProvider {
  constructor(private readonly client: S3Client) { }

  async generateUploadUrl(
    uploadKey: UploadKey
  ): Promise<GenerateUploadUrlResult> {
    const command = new PutObjectCommand({
      Bucket: s3Env.S3_BUCKET,
      Key: uploadKey.toString(),
      ContentType: uploadKey.getMimeType().toString()
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: s3Env.UPLOAD_URL_EXPIRES_IN
    });

    const fileUrl = s3Env.S3_FORCE_PATH_STYLE
      ? `${s3Env.S3_ENDPOINT}/${s3Env.S3_BUCKET}/${uploadKey.toString()}`
      : `https://${s3Env.S3_BUCKET}.s3.${s3Env.S3_REGION}.amazonaws.com/${uploadKey.toString()}`;

    return { uploadUrl, fileUrl };
  }
}
