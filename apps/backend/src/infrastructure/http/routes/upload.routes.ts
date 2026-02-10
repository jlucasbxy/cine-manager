import type { FastifyPluginAsync } from "fastify";
import type { UploadController } from "@/infrastructure/http/controllers";
import type { AuthMiddleware } from "@/infrastructure/http/middlewares";
import { RATE_LIMITS } from "@/infrastructure/config/rate-limit";

interface UploadRoutesOptions {
  uploadController: UploadController;
  authMiddleware: AuthMiddleware;
}

export const uploadRoutes: FastifyPluginAsync<UploadRoutesOptions> = async (
  fastify,
  opts
) => {
  const { uploadController, authMiddleware } = opts;

  fastify.addHook("preHandler", authMiddleware.preHandler);

  fastify.post("/signed-url", {
    config: { rateLimit: RATE_LIMITS.uploadUrl },
    handler: uploadController.generateUploadUrl.bind(uploadController)
  });
};
