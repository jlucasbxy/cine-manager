import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidPasswordError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_PASSWORD, "Password must be between 8 and 64 characters long");
  }
}
