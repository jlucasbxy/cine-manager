import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidNonNegativeNumberError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_NON_NEGATIVE_NUMBER, "Value must be a non-negative number");
  }
}
