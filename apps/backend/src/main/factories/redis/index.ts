import Redis from "ioredis";
import { env } from "@/infrastructure/config/env";
import { singleton } from "@/main/factories/singleton";

export const makeRedisClient = singleton(() => {
  return new Redis(env.REDIS_URL);
});
