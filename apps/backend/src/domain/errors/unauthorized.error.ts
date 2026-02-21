import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class UnauthorizedError extends DomainError {
  constructor() {
    super(ErrorCode.UNAUTHORIZED, "Unauthorized");
  }
}
