import path from "node:path";
import { Uuid } from "@/domain/value-objects";

interface CreateUploadProps {
  fileName: string;
  contentType: string;
  userId: Uuid;
}

export class Upload {
  readonly key: string;
  readonly contentType: string;

  private constructor(data: {
    key: string;
    contentType: string;
  }) {
    this.key = data.key;
    this.contentType = data.contentType;
  }

  static create(props: CreateUploadProps): Upload {
    const id = Uuid.generate();
    const ext = path.extname(props.fileName);
    const key = `uploads/${props.userId.toString()}/${id.toString()}${ext}`;

    return new Upload({
      key,
      contentType: props.contentType,
    });
  }
}
