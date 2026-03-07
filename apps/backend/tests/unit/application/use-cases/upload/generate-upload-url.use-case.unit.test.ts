import { GenerateUploadUrl } from "@/application/use-cases/upload/generate-upload-url.use-case";
import { ImageUpload } from "@/domain/entities/image-upload.entity";
import { ImageMimeTypeEnum } from "@/domain/enums/image-mime-type.enum";
import { ImageMimeType, UploadKey, Url, Uuid } from "@/domain/value-objects";

describe("GenerateUploadUrl", () => {
  const storageProvider = { generateUploadUrl: vi.fn(), deleteFile: vi.fn() };
  const useCase = new GenerateUploadUrl(
    storageProvider as unknown as ConstructorParameters<
      typeof GenerateUploadUrl
    >[0]
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates upload URL and returns DTO", async () => {
    const userId = Uuid.generate();
    const mimeType = ImageMimeType.create(ImageMimeTypeEnum.JPEG);
    const uploadKey = UploadKey.create({ userId, mimeType });
    const imageUpload = ImageUpload.create({
      uploadKey,
      uploadUrl: Url.create("https://s3.example.com/upload"),
      fileUrl: Url.create("https://cdn.example.com/file.jpg")
    });

    storageProvider.generateUploadUrl.mockResolvedValue(imageUpload);

    const result = await useCase.execute(userId.toString(), {
      fileName: "photo.jpg",
      contentType: ImageMimeTypeEnum.JPEG
    });

    expect(result.uploadUrl).toBe("https://s3.example.com/upload");
    expect(result.fileUrl).toBe("https://cdn.example.com/file.jpg");
    expect(result.key).toBeTruthy();
  });
});
