import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class EmailAlreadyInUseError extends DomainError {
  constructor() {
    super(ErrorCode.EMAIL_ALREADY_IN_USE, "Email already in use");
  }
}
