import { RedisCacheProvider } from "@/infrastructure/providers";
import { getIntegrationRedisClient } from "../helpers/integration-context";

describe("RedisCacheProvider integration", () => {
  const redis = getIntegrationRedisClient();
  const provider = new RedisCacheProvider(redis);

  it("stores and retrieves JSON values", async () => {
    await provider.hset({
      key: "movies:list",
      field: "query:a",
      value: { items: ["a", "b"], hasNextPage: false }
    });

    const value = await provider.hget<{
      items: string[];
      hasNextPage: boolean;
    }>({
      key: "movies:list",
      field: "query:a"
    });

    expect(value).toEqual({ items: ["a", "b"], hasNextPage: false });
  });

  it("expires values when ttl is provided", async () => {
    await provider.hset({
      key: "movies:list",
      field: "query:b",
      value: { ok: true },
      ttlSeconds: 1
    });

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const value = await provider.hget<{ ok: boolean }>({
      key: "movies:list",
      field: "query:b"
    });

    expect(value).toBeNull();
  });

  it("deletes cache keys", async () => {
    await provider.hset({
      key: "movies:list",
      field: "query:c",
      value: { ok: true }
    });

    await provider.delete("movies:list");

    const value = await provider.hget<{ ok: boolean }>({
      key: "movies:list",
      field: "query:c"
    });
    expect(value).toBeNull();
  });

  it("treats malformed JSON as a cache miss", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      await redis.hset("movies:list", "query:d", "{invalid-json");

      const value = await provider.hget({
        key: "movies:list",
        field: "query:d"
      });

      expect(value).toBeNull();
      expect(warnSpy).toHaveBeenCalledTimes(1);
    } finally {
      warnSpy.mockRestore();
    }
  });
});
