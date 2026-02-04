import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidNonNegativeIntError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_NON_NEGATIVE_INT, "Value must be a non-negative integer");
  }
}
