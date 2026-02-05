import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class ResetTokenExpiredError extends DomainError {
  constructor() {
    super(ErrorCode.RESET_TOKEN_EXPIRED, "Password reset token has expired");
  }
}
