import { Uuid, ImageMimeType } from "@/domain/value-objects";

interface UploadKeyCreateParams {
  userId: Uuid,
  mimeType: ImageMimeType
}

export class UploadKey {

  private constructor(private readonly key: string, private mimeType: ImageMimeType) { }

  static create(props: UploadKeyCreateParams): UploadKey {
    const id = Uuid.generate();
    const key = `uploads/${props.userId.toString()}/${id.toString()}${props.mimeType.toString()}`;
    return new UploadKey(key, props.mimeType);
  }

  static reconstitute(props: UploadKeyCreateParams): UploadKey {
    return this.create(props);
  }

  public getMimeType(): ImageMimeType {
    return this.mimeType
  }

  public toString(): string {
    return this.key;
  }
}
