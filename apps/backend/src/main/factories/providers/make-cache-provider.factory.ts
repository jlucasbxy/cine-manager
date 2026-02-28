import { RedisCacheProvider } from "@/infrastructure/providers";
import { makeRedisClient } from "@/main/factories/redis";
import { singleton } from "@/main/factories/singleton.util";

export const makeCacheProvider = singleton(
  () => new RedisCacheProvider(makeRedisClient())
);
