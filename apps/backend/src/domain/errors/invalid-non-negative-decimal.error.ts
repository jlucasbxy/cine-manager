import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidNonNegativeDecimalError extends DomainError {
  constructor() {
    super(
      ErrorCode.INVALID_NON_NEGATIVE_NUMBER,
      "Value must be a non-negative number"
    );
  }
}
