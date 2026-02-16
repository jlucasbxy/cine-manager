import axios from "axios";

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export function setAccessToken(token: string, expiresIn: number) {
  accessToken = token;
  tokenExpiresAt = Date.now() + expiresIn * 1000;
  scheduleRefresh(expiresIn);
}

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

function scheduleRefresh(expiresIn: number) {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  const refreshIn = Math.max((expiresIn - 60) * 1000, 0);
  refreshTimer = setTimeout(async () => {
    try {
      const response = await apiClient.post<{
        accessToken: string;
        expiresIn: number;
      }>("/auth/refresh");
      setAccessToken(response.data.accessToken, response.data.expiresIn);
    } catch {
      clearAccessToken();
    }
  }, refreshIn);
}

export const apiClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
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
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
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
