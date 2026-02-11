import { ImageMimeType, UploadKey } from "@/domain/value-objects";

interface CreateImageUploadProps {
  uploadKey: UploadKey;
  uploadUrl: string;
  fileUrl: string;
}

export class ImageUpload {
  readonly key: UploadKey;
  readonly contentType: ImageMimeType;
  readonly uploadUrl: string;
  readonly fileUrl: string;

  private constructor(data: {
    key: UploadKey;
    contentType: ImageMimeType;
    uploadUrl: string;
    fileUrl: string;
  }) {
    this.key = data.key;
    this.contentType = data.contentType;
    this.uploadUrl = data.uploadUrl;
    this.fileUrl = data.fileUrl;
  }

  static create(props: CreateImageUploadProps): ImageUpload {
    return new ImageUpload({
      key: props.uploadKey,
      contentType: props.uploadKey.getMimeType(),
      uploadUrl: props.uploadUrl,
      fileUrl: props.fileUrl
    });
  }
}
