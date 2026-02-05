import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password");
  }
}
