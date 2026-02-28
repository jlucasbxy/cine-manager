import type Redis from "ioredis";
import type {
  CacheProvider,
  HGetParams,
  HSetParams
} from "@/application/interfaces/providers/cache-provider";

export class RedisCacheProvider implements CacheProvider {
  constructor(private readonly redis: Redis) {}

  async hget<T = unknown>({ key, field }: HGetParams): Promise<T | null> {
    const value = await this.redis.hget(key, field);
    if (value === null) return null;
    return JSON.parse(value) as T;
  }

  async hset<T = unknown>({
    key,
    field,
    value,
    ttlSeconds
  }: HSetParams<T>): Promise<void> {
    if (ttlSeconds) {
      await this.redis
        .multi()
        .hset(key, field, JSON.stringify(value))
        .expire(key, ttlSeconds)
        .exec();
    } else {
      await this.redis.hset(key, field, JSON.stringify(value));
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
