import type { UserDTO } from "@repo/dtos";
import { vi } from "vitest";
import type { useAuth } from "@/hooks/use-auth";

type AuthState = ReturnType<typeof useAuth>;

export const defaultUser: UserDTO = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane@example.com",
  avatarUrl: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z"
};

export function createAuthState(overrides: Partial<AuthState> = {}): AuthState {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(async () => undefined),
    register: vi.fn(async () => undefined),
    logout: vi.fn(async () => undefined),
    updateUser: vi.fn(async () => undefined),
    ...overrides
  };
}
