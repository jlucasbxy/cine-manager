import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { ImageMimeType, Uuid } from "@/domain/value-objects";
import { UploadKey } from "@/domain/value-objects/upload-key.value-object";
import { S3StorageProvider } from "@/infrastructure/providers";
import {
  getIntegrationS3Client,
  getIntegrationS3Config
} from "../helpers/integration-context";

describe("S3StorageProvider integration", () => {
  const s3Config = getIntegrationS3Config();
  const client = getIntegrationS3Client();
  const bucket = s3Config.bucket;

  const provider = new S3StorageProvider(client, {
    bucket: s3Config.bucket,
    region: s3Config.region,
    endpoint: s3Config.endpoint,
    forcePathStyle: s3Config.forcePathStyle,
    uploadUrlExpiresIn: 900
  });

  it("generates a signed upload URL and stores bytes via HTTP PUT", async () => {
    const uploadKey = UploadKey.create({
      userId: Uuid.generate(),
      mimeType: ImageMimeType.create("image/png")
    });
    const payload = "fake-image-content";

    const imageUpload = await provider.generateUploadUrl(uploadKey);

    const putResponse = await fetch(imageUpload.uploadUrl.toString(), {
      method: "PUT",
      headers: { "content-type": "image/png" },
      body: payload
    });

    expect(putResponse.status).toBe(200);

    const head = await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: imageUpload.key.toString()
      })
    );
    expect(head.ContentType).toBe("image/png");

    const object = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: imageUpload.key.toString()
      })
    );
    const content = await object.Body?.transformToString();
    expect(content).toBe(payload);

    await provider.deleteFile(imageUpload.key.toString());

    await expect(
      client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: imageUpload.key.toString()
        })
      )
    ).rejects.toMatchObject({
      $metadata: { httpStatusCode: 404 }
    });
  });
});
