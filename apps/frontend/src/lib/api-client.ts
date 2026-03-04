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

// Single in-flight refresh promise shared between the proactive timer and the
// reactive 401 interceptor. Prevents duplicate /auth/refresh calls when both
// fire at the same time (e.g. a request fails with 401 right as the timer fires).
let refreshPromise: Promise<{ accessToken: string; expiresIn: number }> | null =
  null;

function doRefresh(): Promise<{ accessToken: string; expiresIn: number }> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = apiClient
    .post<{ accessToken: string; expiresIn: number }>("/auth/refresh")
    .then((res) => res.data)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
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
      const data = await doRefresh();
      setAccessToken(data.accessToken, data.expiresIn);
    } catch {
      // Refresh failed (e.g. refresh token expired) — force the user to log in again.
      clearAccessToken();
    }
  }, refreshIn);
}

export const apiClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
  paramsSerializer: { indexes: null }
});

// Attach the Bearer token to every outgoing request when one is available.
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

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
      originalRequest._retry = true;

      try {
        // doRefresh() deduplicates concurrent calls — if the proactive timer
        // already triggered a refresh, we share that same promise instead of
        // firing a second /auth/refresh request.
        const data = await doRefresh();
        setAccessToken(data.accessToken, data.expiresIn);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
