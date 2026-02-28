export interface SetParams<T = unknown> {
  key: string;
  value: T;
  ttlSeconds?: number;
}

export interface HGetParams {
  key: string;
  field: string;
}

export interface HSetParams<T = unknown> {
  key: string;
  field: string;
  value: T;
  ttlSeconds?: number;
}

export interface CacheProvider {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(params: SetParams<T>): Promise<void>;
  hget<T = unknown>(params: HGetParams): Promise<T | null>;
  hset<T = unknown>(params: HSetParams<T>): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  increment(key: string, amount?: number): Promise<number>;
  decrement(key: string, amount?: number): Promise<number>;
  setExpire(key: string, ttlSeconds: number): Promise<void>;
  flush(): Promise<void>;
}
