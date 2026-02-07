import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { DomainError } from "@/domain/errors";
import { ErrorPresenter } from "@/infra/http/presenters";

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof DomainError) {
    const statusCode = ErrorPresenter.httpStatusFor(error.code);
    const body = ErrorPresenter.toResponse(statusCode, error.code, error.message);
    return reply.status(statusCode).send(body);
  }

  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Validation error";
    const body = ErrorPresenter.toResponse(400, "VALIDATION_ERROR", message);
    return reply.status(400).send(body);
  }

  request.log.error(error);
  const body = ErrorPresenter.toResponse(500, "INTERNAL_SERVER_ERROR", "Internal Server Error");
  return reply.status(500).send(body);
}
