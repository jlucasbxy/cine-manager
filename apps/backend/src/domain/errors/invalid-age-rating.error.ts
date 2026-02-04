import { ErrorCode } from "@repo/dtos";
import { DomainError } from "./domain.error";

export class InvalidAgeRatingError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_AGE_RATING, "Invalid age rating");
  }
}
