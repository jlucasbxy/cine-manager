import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidUrlError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_URL, "Invalid URL");
  }
}
