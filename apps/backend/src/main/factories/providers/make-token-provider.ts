import { JwtTokenProvider } from "@/infrastructure/providers";
import { env } from "@/infrastructure/config/env";
import { singleton } from "@/main/factories/singleton";

export const makeTokenProvider = singleton(
  () => new JwtTokenProvider(env.ACCESS_TOKEN_SECRET)
);
