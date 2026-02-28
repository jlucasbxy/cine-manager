export interface CacheProvider {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  hget<T = unknown>(key: string, field: string): Promise<T | null>;
  hset<T = unknown>(key: string, field: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  increment(key: string, amount?: number): Promise<number>;
  decrement(key: string, amount?: number): Promise<number>;
  setExpire(key: string, ttlSeconds: number): Promise<void>;
  flush(): Promise<void>;
}
