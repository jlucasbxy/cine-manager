import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidUuidError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_UUID, "Invalid UUID");
  }
}
