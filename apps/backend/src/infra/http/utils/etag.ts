import { createHash } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";

export function sendWithEtag(
  request: FastifyRequest,
  reply: FastifyReply,
  body: unknown
) {
  const json = JSON.stringify(body);
  const etag = `"${createHash("md5").update(json).digest("hex")}"`;

  reply.header("Cache-Control", "private, max-age=300, must-revalidate");
  reply.header("ETag", etag);

  if (request.headers["if-none-match"] === etag) {
    return reply.status(304).send();
  }

  return reply.status(200).send(body);
}
