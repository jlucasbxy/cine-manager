import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidImageMimeTypeError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_IMAGE_MIME_TYPE, "Invalid image mime type");
  }
}
