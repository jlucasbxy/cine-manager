import { DeleteObjectCommand, PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { StorageProvider } from "@/application/interfaces/providers";
import { ImageUpload } from "@/domain/entities";
import { type UploadKey, Url } from "@/domain/value-objects";

interface S3StorageProviderConfig {
  bucket: string;
  region: string;
  endpoint?: string;
  forcePathStyle: boolean;
  uploadUrlExpiresIn: number;
}

export class S3StorageProvider implements StorageProvider {
  constructor(
    private readonly client: S3Client,
    private readonly config: S3StorageProviderConfig
  ) {}

  async generateUploadUrl(uploadKey: UploadKey): Promise<ImageUpload> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: uploadKey.toString(),
      ContentType: uploadKey.getMimeType().toString()
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: this.config.uploadUrlExpiresIn
    });

    const fileUrl = this.config.forcePathStyle
      ? `${this.config.endpoint}/${this.config.bucket}/${uploadKey.toString()}`
      : `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${uploadKey.toString()}`;

    return ImageUpload.create({
      uploadKey,
      uploadUrl: Url.create(uploadUrl),
      fileUrl: Url.create(fileUrl)
    });
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key
    });
    await this.client.send(command);
  }
}
