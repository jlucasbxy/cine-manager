import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class TokenRevokedError extends DomainError {
  constructor() {
    super(ErrorCode.TOKEN_REVOKED, "Token has been revoked");
  }
}
