import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class InvalidMovieQueryError extends DomainError {
  constructor(message: string) {
    super(ErrorCode.INVALID_MOVIE_QUERY, message);
  }
}
