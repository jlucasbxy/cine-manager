import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors/domain.error";

export class MovieListNotFoundError extends DomainError {
  constructor() {
    super(ErrorCode.MOVIE_LIST_NOT_FOUND, "Movie list not found");
  }
}
