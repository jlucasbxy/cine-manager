import path from "node:path";
import { ImageMimeType, Uuid } from "@/domain/value-objects";

interface CreateImageUploadProps {
  fileName: string;
  contentType: string;
  userId: Uuid;
}

export class ImageUpload {
  readonly key: string;
  readonly contentType: ImageMimeType;

  private constructor(data: {
    key: string;
    contentType: ImageMimeType;
  }) {
    this.key = data.key;
    this.contentType = data.contentType;
  }

  static create(props: CreateImageUploadProps): ImageUpload {
    const id = Uuid.generate();
    const ext = path.extname(props.fileName);
    const key = `uploads/${props.userId.toString()}/${id.toString()}${ext}`;

    return new ImageUpload({
      key,
      contentType: ImageMimeType.create(props.contentType),
    });
  }
}
