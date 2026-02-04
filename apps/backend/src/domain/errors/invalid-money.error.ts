import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidMoneyError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_MONEY, "Value must be a non-negative number");
  }
}
