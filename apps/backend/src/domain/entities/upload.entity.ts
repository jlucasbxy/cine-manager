import path from "node:path";
import { Uuid } from "@/domain/value-objects";

interface CreateUploadProps {
  fileName: string;
  contentType: string;
  userId: Uuid;
}

export class Upload {
  readonly id: Uuid;
  readonly key: string;
  readonly fileName: string;
  readonly contentType: string;
  readonly userId: Uuid;
  readonly createdAt: Date;

  private constructor(data: {
    id: Uuid;
    key: string;
    fileName: string;
    contentType: string;
    userId: Uuid;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.key = data.key;
    this.fileName = data.fileName;
    this.contentType = data.contentType;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
  }

  static create(props: CreateUploadProps): Upload {
    const id = Uuid.generate();
    const ext = path.extname(props.fileName);
    const key = `uploads/${props.userId.toString()}/${id.toString()}${ext}`;

    return new Upload({
      id,
      key,
      fileName: props.fileName,
      contentType: props.contentType,
      userId: props.userId,
      createdAt: new Date()
    });
  }

}
