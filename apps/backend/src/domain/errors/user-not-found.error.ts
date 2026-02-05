import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class UserNotFoundError extends DomainError {
  constructor() {
    super(ErrorCode.USER_NOT_FOUND, "User not found");
  }
}
