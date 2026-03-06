import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { UploadKey } from "@/domain/value-objects/upload-key.value-object";
import { ImageMimeType, Uuid } from "@/domain/value-objects";
import { S3StorageProvider } from "@/infrastructure/providers";

const requiredEnv = (
  name:
    | "S3_BUCKET"
    | "S3_REGION"
    | "S3_ENDPOINT"
    | "S3_ACCESS_KEY_ID"
    | "S3_SECRET_ACCESS_KEY"
): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for integration tests`);
  }
  return value;
};

describe("S3StorageProvider integration", () => {
  const bucket = requiredEnv("S3_BUCKET");
  const region = requiredEnv("S3_REGION");
  const endpoint = requiredEnv("S3_ENDPOINT");
  const accessKeyId = requiredEnv("S3_ACCESS_KEY_ID");
  const secretAccessKey = requiredEnv("S3_SECRET_ACCESS_KEY");

  const client = new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey }
  });

  const provider = new S3StorageProvider(client, {
    bucket,
    region,
    endpoint,
    forcePathStyle: true,
    uploadUrlExpiresIn: 900
  });

  afterAll(() => {
    client.destroy();
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
