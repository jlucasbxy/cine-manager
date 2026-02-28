import Redis from "ioredis";
import { env } from "../../../infrastructure/config/env.config";
import { singleton } from "../singleton.util";

export const makeRedisClient = singleton(() => {
  return new Redis(env.REDIS_URL);
});
