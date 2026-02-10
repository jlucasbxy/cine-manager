import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidContentTypeError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_CONTENT_TYPE, "Invalid content type");
  }
}
