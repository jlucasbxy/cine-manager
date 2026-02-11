import { Uuid, ImageMimeType } from "@/domain/value-objects";

export class UploadKey {

  private constructor(private readonly key: string, private mimeType: ImageMimeType) { }

  static create(userId: Uuid, mimeType: ImageMimeType): UploadKey {
    const id = Uuid.generate();
    const key = `uploads/${userId.toString()}/${id.toString()}${mimeType.toString()}`;
    return new UploadKey(key, mimeType);
  }

  static reconstitute(userId: Uuid, mimeType: ImageMimeType): UploadKey {
    return this.create(userId, mimeType);
  }

  public getMimeType(): ImageMimeType {
    return this.mimeType
  }

  public toString(): string {
    return this.key;
  }
}
