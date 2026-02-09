import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { ErrorCode } from "@repo/dtos";
import { DomainError } from "@/domain/errors";
import { ErrorPresenter } from "@/infrastructure/http/presenters";

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof DomainError) {
    const statusCode = ErrorPresenter.httpStatusFor(error.code);
    const body = ErrorPresenter.toResponse(error.code, error.message);
    return reply.status(statusCode).send(body);
  }

  if (error instanceof ZodError) {
    const messages = error.issues.map((issue) => issue.message);
    const body = ErrorPresenter.toResponse(
      ErrorCode.VALIDATION_ERROR,
      messages
    );
    return reply.status(400).send(body);
  }

  request.log.error(error);
  const body = ErrorPresenter.toResponse(
    ErrorCode.INTERNAL_SERVER_ERROR,
    "Internal Server Error"
  );
  return reply.status(500).send(body);
}
