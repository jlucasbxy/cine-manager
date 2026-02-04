import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class MovieNotFoundError extends DomainError {
  constructor() {
    super(ErrorCode.MOVIE_NOT_FOUND, "Movie not found");
  }
}
