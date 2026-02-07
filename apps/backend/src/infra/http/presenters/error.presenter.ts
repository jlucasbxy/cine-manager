import { ErrorCode } from "@repo/dtos";

const STATUS_MAP: Record<ErrorCode, number> = {
  [ErrorCode.INVALID_EMAIL]: 400,
  [ErrorCode.INVALID_PASSWORD]: 400,
  [ErrorCode.INVALID_URL]: 400,
  [ErrorCode.INVALID_UUID]: 400,
  [ErrorCode.INVALID_NON_NEGATIVE_INT]: 400,
  [ErrorCode.INVALID_NON_NEGATIVE_NUMBER]: 400,
  [ErrorCode.INVALID_AGE_RATING]: 400,
  [ErrorCode.INVALID_MOVIE_STATUS]: 400,
  [ErrorCode.INVALID_MOVIE_QUERY]: 400,
  [ErrorCode.RESET_TOKEN_EXPIRED]: 400,
  [ErrorCode.RESET_TOKEN_INVALID]: 400,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.INVALID_CREDENTIALS]: 401,
  [ErrorCode.TOKEN_EXPIRED]: 401,
  [ErrorCode.TOKEN_INVALID]: 401,
  [ErrorCode.TOKEN_REVOKED]: 401,
  [ErrorCode.MOVIE_NOT_FOUND]: 404,
  [ErrorCode.USER_NOT_FOUND]: 404,
  [ErrorCode.EMAIL_ALREADY_IN_USE]: 409,
  [ErrorCode.INTERNAL_SERVER_ERROR]: 500
};

const STATUS_TEXT: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  409: "Conflict",
  500: "Internal Server Error"
};

export class ErrorPresenter {
  static httpStatusFor(code: ErrorCode): number {
    return STATUS_MAP[code];
  }

  static toResponse(
    statusCode: number,
    code: ErrorCode,
    message: string | string[]
  ) {
    return {
      statusCode,
      error: STATUS_TEXT[statusCode] ?? "Error",
      code,
      message
    };
  }
}
