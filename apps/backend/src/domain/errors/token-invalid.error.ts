import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class TokenInvalidError extends DomainError {
  constructor() {
    super(ErrorCode.TOKEN_INVALID, "Token is invalid");
  }
}
