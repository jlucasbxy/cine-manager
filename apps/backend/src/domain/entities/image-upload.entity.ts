import type { ImageMimeType, UploadKey, Url } from "@/domain/value-objects";

interface CreateImageUploadProps {
  uploadKey: UploadKey;
  uploadUrl: Url;
  fileUrl: Url;
}

export class ImageUpload {
  readonly key: UploadKey;
  readonly contentType: ImageMimeType;
  readonly uploadUrl: Url;
  readonly fileUrl: Url;

  private constructor(data: {
    key: UploadKey;
    contentType: ImageMimeType;
    uploadUrl: Url;
    fileUrl: Url;
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
