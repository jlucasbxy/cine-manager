import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class WeakPasswordError extends DomainError {
  constructor() {
    super(
      ErrorCode.WEAK_PASSWORD,
      "Password is too weak. Use a longer password with a mix of letters, numbers, and symbols."
    );
  }
}
