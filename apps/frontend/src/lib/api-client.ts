import axios from "axios";

// In-memory token state. The access token is never stored in localStorage/cookies
// to reduce XSS exposure; the refresh token lives in an httpOnly cookie handled by the server.
let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

// Stores the new access token and schedules a proactive refresh before it expires.
export function setAccessToken(token: string, expiresIn: number) {
  accessToken = token;
  tokenExpiresAt = Date.now() + expiresIn * 1000;
  scheduleRefresh(expiresIn);
}

// Wipes the token state and cancels any pending refresh timer (e.g. on logout).
export function clearAccessToken() {
  accessToken = null;
  tokenExpiresAt = null;
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

export function getAccessToken() {
  return accessToken;
}

export function getTokenExpiresAt() {
  return tokenExpiresAt;
}

// Schedules a silent token refresh 60 seconds before the token expires.
// This keeps the session alive without the user noticing any interruption.
function scheduleRefresh(expiresIn: number) {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  // Refresh 60s early; clamp to 0 so we never schedule a negative delay.
  const refreshIn = Math.max((expiresIn - 60) * 1000, 0);
  refreshTimer = setTimeout(async () => {
    try {
      const response = await apiClient.post<{
        accessToken: string;
        expiresIn: number;
      }>("/auth/refresh");
      setAccessToken(response.data.accessToken, response.data.expiresIn);
    } catch {
      // Refresh failed (e.g. refresh token expired) — force the user to log in again.
      clearAccessToken();
    }
  }, refreshIn);
}

export const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach the Bearer token to every outgoing request when one is available.
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Tracks whether a token refresh is already in flight.
let isRefreshing = false;
// Requests that arrived while a refresh was in progress are queued here
// so they can be retried with the new token once refresh completes.
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

// Drains the queue: resolves each waiting request with the new token,
// or rejects them all if the refresh itself failed.
function processQueue(error: unknown, token: string | null = null) {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  }
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt a refresh on 401 responses from non-auth endpoints
    // and only once per request (_retry flag prevents infinite loops).
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
        // A refresh is already running — queue this request and wait for it to finish.
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await apiClient.post<{
          accessToken: string;
          expiresIn: number;
        }>("/auth/refresh");
        const { accessToken: newToken, expiresIn } = response.data;
        setAccessToken(newToken, expiresIn);
        // Let all queued requests through with the new token.
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed — reject every queued request and clear the session.
        processQueue(refreshError, null);
        clearAccessToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
