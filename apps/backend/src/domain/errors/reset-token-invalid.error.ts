import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class ResetTokenInvalidError extends DomainError {
  constructor() {
    super(ErrorCode.RESET_TOKEN_INVALID, "Password reset token is invalid");
  }
}
