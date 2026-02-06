import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidMovieStatusError extends DomainError {
  constructor() {
    super(ErrorCode.INVALID_MOVIE_STATUS, "Invalid movie status");
  }
}
