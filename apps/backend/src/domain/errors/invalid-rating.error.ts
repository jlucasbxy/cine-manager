import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidRatingError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_RATING, "Rating must be between 1 and 10");
  }
}
