import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class TokenExpiredError extends DomainError {
  constructor() {
    super(ErrorCode.TOKEN_EXPIRED, "Token has expired");
  }
}
