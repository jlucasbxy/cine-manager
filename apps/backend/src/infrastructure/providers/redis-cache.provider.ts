import type Redis from "ioredis";
import type {
  CacheProvider,
  HGetParams,
  HSetParams
} from "@/application/interfaces/providers/cache-provider";

export class RedisCacheProvider implements CacheProvider {
  constructor(private readonly redis: Redis) {}

  async hget<T = unknown>({ key, field }: HGetParams): Promise<T | null> {
    try {
      const value = await this.redis.hget(key, field);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (err) {
      process.stderr.write(
        `[RedisCacheProvider] hget failed, treating as cache miss: ${String(err)}\n`
      );
      return null;
    }
  }

  async hset<T = unknown>({
    key,
    field,
    value,
    ttlSeconds
  }: HSetParams<T>): Promise<void> {
    try {
      if (ttlSeconds) {
        await this.redis
          .multi()
          .hset(key, field, JSON.stringify(value))
          .expire(key, ttlSeconds)
          .exec();
      } else {
        await this.redis.hset(key, field, JSON.stringify(value));
      }
    } catch (err) {
      process.stderr.write(
        `[RedisCacheProvider] hset failed: ${String(err)}\n`
      );
    }
  }

  async delete(...keys: string[]): Promise<void> {
    try {
      await this.redis.del(...keys);
    } catch (err) {
      process.stderr.write(
        `[RedisCacheProvider] delete failed: ${String(err)}\n`
      );
    }
  }
}
