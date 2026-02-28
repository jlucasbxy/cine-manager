import type Redis from "ioredis";
import type {
  CacheProvider,
  HGetParams,
  HSetParams,
  SetParams
} from "@/application/interfaces/providers/cache-provider";

export class RedisCacheProvider implements CacheProvider {
  constructor(private readonly redis: Redis) {}

  async get<T = unknown>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (value === null) return null;
    return JSON.parse(value) as T;
  }

  async set<T = unknown>({
    key,
    value,
    ttlSeconds
  }: SetParams<T>): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.set(key, serialized, "EX", ttlSeconds);
    } else {
      await this.redis.set(key, serialized);
    }
  }

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

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async increment(key: string, amount = 1): Promise<number> {
    return this.redis.incrby(key, amount);
  }

  async decrement(key: string, amount = 1): Promise<number> {
    return this.redis.decrby(key, amount);
  }

  async setExpire(key: string, ttlSeconds: number): Promise<void> {
    await this.redis.expire(key, ttlSeconds);
  }

  async flush(): Promise<void> {
    await this.redis.flushdb();
  }
}
