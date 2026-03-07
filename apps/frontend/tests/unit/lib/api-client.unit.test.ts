import type {
  AxiosAdapter,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  apiClient,
  clearAccessToken,
  getAccessToken,
  getTokenExpiresAt,
  setAccessToken
} from "@/lib/api-client";

const initialAdapter = apiClient.defaults.adapter;

function createResponse<T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 200
): AxiosResponse<T> {
  return {
    config,
    data,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: {}
  };
}

function rejectWithStatus(config: InternalAxiosRequestConfig, status: number) {
  return Promise.reject({
    config,
    response: createResponse(config, { message: "request failed" }, status)
  });
}

function getAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const headers = config.headers as
    | { Authorization?: string; get?: (name: string) => string | undefined }
    | undefined;

  if (!headers) return undefined;
  if (typeof headers.get === "function") {
    return headers.get("Authorization");
  }
  return headers.Authorization;
}

describe("api-client auth behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    clearAccessToken();
  });

  afterEach(() => {
    clearAccessToken();
    apiClient.defaults.adapter = initialAdapter;
    vi.useRealTimers();
  });

  it("stores token and expiration timestamp", () => {
    const now = Date.now();

    setAccessToken("token-123", 120);

    expect(getAccessToken()).toBe("token-123");
    expect(getTokenExpiresAt()).toBe(now + 120_000);
  });

  it("attaches Authorization header when access token exists", async () => {
    let authorizationHeader: string | undefined;

    const adapter: AxiosAdapter = async (config) => {
      authorizationHeader = getAuthorizationHeader(config);
      return createResponse(config, { ok: true });
    };
    apiClient.defaults.adapter = adapter;

    setAccessToken("token-abc", 120);
    await apiClient.get("/movies");

    expect(authorizationHeader).toBe("Bearer token-abc");
  });

  it("refreshes token on 401 and retries the original request", async () => {
    let movieCalls = 0;
    let refreshCalls = 0;

    const adapter: AxiosAdapter = async (config) => {
      if (config.url === "/movies") {
        movieCalls += 1;
        if (movieCalls === 1) {
          return rejectWithStatus(config, 401);
        }

        return createResponse(config, {
          ok: true,
          authorization: getAuthorizationHeader(config)
        });
      }

      if (config.url === "/auth/refresh") {
        refreshCalls += 1;
        return createResponse(config, {
          accessToken: "refreshed-token",
          expiresIn: 120
        });
      }

      return createResponse(config, {});
    };
    apiClient.defaults.adapter = adapter;

    setAccessToken("expired-token", 120);
    const response = await apiClient.get("/movies");

    expect(response.data.ok).toBe(true);
    expect(response.data.authorization).toBe("Bearer refreshed-token");
    expect(movieCalls).toBe(2);
    expect(refreshCalls).toBe(1);
    expect(getAccessToken()).toBe("refreshed-token");
  });

  it("does not trigger refresh for /auth/login or /auth/refresh 401 responses", async () => {
    let refreshCalls = 0;

    const adapter: AxiosAdapter = async (config) => {
      if (config.url === "/auth/refresh") {
        refreshCalls += 1;
        return rejectWithStatus(config, 401);
      }

      if (config.url === "/auth/login") {
        return rejectWithStatus(config, 401);
      }

      return createResponse(config, {});
    };
    apiClient.defaults.adapter = adapter;

    await expect(apiClient.post("/auth/login")).rejects.toBeDefined();
    expect(refreshCalls).toBe(0);

    await expect(apiClient.post("/auth/refresh")).rejects.toBeDefined();
    expect(refreshCalls).toBe(1);
  });

  it("deduplicates concurrent refresh attempts on simultaneous 401 responses", async () => {
    let refreshCalls = 0;
    let movieCalls = 0;
    let unauthorizedCount = 0;

    const adapter: AxiosAdapter = (config) => {
      if (config.url?.startsWith("/movies")) {
        movieCalls += 1;
        if (unauthorizedCount < 2) {
          unauthorizedCount += 1;
          return rejectWithStatus(config, 401);
        }

        return Promise.resolve(
          createResponse(config, {
            ok: true,
            authorization: getAuthorizationHeader(config)
          })
        );
      }

      if (config.url === "/auth/refresh") {
        refreshCalls += 1;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              createResponse(config, {
                accessToken: "shared-refreshed-token",
                expiresIn: 120
              })
            );
          }, 10);
        });
      }

      return Promise.resolve(createResponse(config, {}));
    };
    apiClient.defaults.adapter = adapter;

    setAccessToken("expired-token", 120);

    const requests = Promise.all([
      apiClient.get("/movies?request=1"),
      apiClient.get("/movies?request=2")
    ]);

    await vi.advanceTimersByTimeAsync(10);
    const [first, second] = await requests;

    expect(refreshCalls).toBe(1);
    expect(movieCalls).toBe(4);
    expect(first.data.authorization).toBe("Bearer shared-refreshed-token");
    expect(second.data.authorization).toBe("Bearer shared-refreshed-token");
    expect(getAccessToken()).toBe("shared-refreshed-token");
  });

  it("clears auth state when refresh after 401 fails", async () => {
    const adapter: AxiosAdapter = async (config) => {
      if (config.url === "/movies") {
        return rejectWithStatus(config, 401);
      }

      if (config.url === "/auth/refresh") {
        return rejectWithStatus(config, 401);
      }

      return createResponse(config, {});
    };
    apiClient.defaults.adapter = adapter;

    setAccessToken("expired-token", 120);

    await expect(apiClient.get("/movies")).rejects.toBeDefined();
    expect(getAccessToken()).toBeNull();
    expect(getTokenExpiresAt()).toBeNull();
  });

  it("clearAccessToken resets state and cancels pending proactive refresh", async () => {
    let refreshCalls = 0;

    const adapter: AxiosAdapter = async (config) => {
      if (config.url === "/auth/refresh") {
        refreshCalls += 1;
        return createResponse(config, {
          accessToken: "new-token",
          expiresIn: 120
        });
      }

      return createResponse(config, {});
    };
    apiClient.defaults.adapter = adapter;

    setAccessToken("token-to-clear", 120);
    clearAccessToken();

    expect(getAccessToken()).toBeNull();
    expect(getTokenExpiresAt()).toBeNull();

    await vi.advanceTimersByTimeAsync(60_000);
    expect(refreshCalls).toBe(0);
  });

  it("runs proactive refresh timer and updates token when refresh succeeds", async () => {
    let refreshCalls = 0;

    const adapter: AxiosAdapter = async (config) => {
      if (config.url === "/auth/refresh") {
        refreshCalls += 1;
        return createResponse(config, {
          accessToken: "proactive-token",
          expiresIn: 120
        });
      }

      return createResponse(config, {});
    };
    apiClient.defaults.adapter = adapter;

    setAccessToken("initial-token", 120);

    await vi.advanceTimersByTimeAsync(59_999);
    expect(refreshCalls).toBe(0);

    await vi.advanceTimersByTimeAsync(1);
    expect(refreshCalls).toBe(1);
    expect(getAccessToken()).toBe("proactive-token");
  });
});
