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
  hget<T = unknown>(params: HGetParams): Promise<T | null>;
  hset<T = unknown>(params: HSetParams<T>): Promise<void>;
  delete(...keys: string[]): Promise<void>;
}
