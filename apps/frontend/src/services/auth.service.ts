import type { CreateUserDTO, LoginResultDTO, UserDTO } from "@repo/dtos";
import { apiClient } from "@/lib/api-client";

export async function login(email: string, password: string) {
  const response = await apiClient.post<Omit<LoginResultDTO, "refreshToken">>(
    "/auth/login",
    { email, password }
  );
  return response.data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function refreshTokens() {
  const response =
    await apiClient.post<Omit<LoginResultDTO, "refreshToken">>("/auth/refresh");
  return response.data;
}

export async function requestPasswordReset(email: string) {
  await apiClient.post("/auth/password-reset/request", { email });
}

export async function resetPassword(token: string, newPassword: string) {
  await apiClient.post("/auth/password-reset/reset", { token, newPassword });
}

export async function register(data: CreateUserDTO) {
  const response = await apiClient.post<UserDTO>("/users", data);
  return response.data;
}

export async function getMe() {
  const response = await apiClient.get<UserDTO>("/users/me");
  return response.data;
}

export async function updateUser(data: { name?: string; password?: string }) {
  const response = await apiClient.patch<UserDTO>("/users", data);
  return response.data;
}
