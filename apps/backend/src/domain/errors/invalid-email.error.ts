import { ErrorCode } from "@repo/dtos";
import { DomainError } from "./domain.error";

export class InvalidEmailError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_EMAIL, "Invalid email address");
  }
}
