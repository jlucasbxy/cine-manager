import { env } from "@/infrastructure/config/env.config";
import { JwtTokenProvider } from "@/infrastructure/providers";
import { singleton } from "@/main/factories/singleton.util";

export const makeTokenProvider = singleton(
  () => new JwtTokenProvider(env.ACCESS_TOKEN_SECRET)
);
