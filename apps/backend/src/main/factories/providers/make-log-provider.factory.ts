import pino from "pino";
import { env } from "@/infrastructure/config/env.config";
import { PinoLogProvider } from "@/infrastructure/providers";
import { singleton } from "@/main/factories/singleton.util";

export const makeLogProvider = singleton(() => {
  const logger = pino(
    env.IS_DEVELOPMENT
      ? {
          transport: {
            target: "pino-pretty",
            options: { translateTime: "HH:MM:ss", ignore: "pid,hostname" }
          }
        }
      : {}
  );

  return PinoLogProvider.fromLogger(logger);
});
