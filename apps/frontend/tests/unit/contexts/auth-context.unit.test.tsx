import type { UserDTO } from "@repo/dtos";
import { act, renderHook, waitFor } from "@testing-library/react";
import React, { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/use-auth";
import { clearAccessToken, setAccessToken } from "@/lib/api-client";
import * as authService from "@/services/auth.service";
import { defaultUser } from "../../utils/auth-helpers";

vi.mock("@/services/auth.service", () => ({
  login: vi.fn(),
  logout: vi.fn(),
  refreshTokens: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
  register: vi.fn(),
  getMe: vi.fn(),
  updateUser: vi.fn()
}));

vi.mock("@/lib/api-client", () => ({
  clearAccessToken: vi.fn(),
  setAccessToken: vi.fn()
}));

function Wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

function getStoredUser() {
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  return JSON.parse(stored) as UserDTO;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(authService.refreshTokens).mockRejectedValue(
      new Error("No active session")
    );
    vi.mocked(authService.getMe).mockResolvedValue(defaultUser);
    vi.mocked(authService.login).mockResolvedValue({
      accessToken: "default-token",
      expiresIn: 1800
    });
    vi.mocked(authService.register).mockResolvedValue(defaultUser);
    vi.mocked(authService.logout).mockResolvedValue(undefined);
    vi.mocked(authService.updateUser).mockResolvedValue(defaultUser);
  });

  it("restores session with stored user and finishes loading", async () => {
    const storedUser: UserDTO = {
      ...defaultUser,
      name: "Stored User"
    };
    const restoredUser: UserDTO = {
      ...defaultUser,
      name: "Restored User"
    };

    localStorage.setItem("user", JSON.stringify(storedUser));
    vi.mocked(authService.refreshTokens).mockResolvedValue({
      accessToken: "restored-token",
      expiresIn: 3600
    });
    vi.mocked(authService.getMe).mockResolvedValue(restoredUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: Wrapper
    });

    expect(result.current.user).toEqual(storedUser);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(restoredUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(setAccessToken).toHaveBeenCalledWith("restored-token", 3600);
    expect(getStoredUser()).toEqual(restoredUser);
  });

  it("clears user and token when session restoration fails", async () => {
    localStorage.setItem("user", JSON.stringify(defaultUser));

    const { result } = renderHook(() => useAuth(), {
      wrapper: Wrapper
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(clearAccessToken).toHaveBeenCalledTimes(1);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("logs in and stores the authenticated user", async () => {
    const loggedInUser: UserDTO = {
      ...defaultUser,
      name: "Logged User"
    };
    vi.mocked(authService.login).mockResolvedValue({
      accessToken: "login-token",
      expiresIn: 900
    });
    vi.mocked(authService.getMe).mockResolvedValue(loggedInUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: Wrapper
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login("jane@example.com", "secret123");
    });

    expect(authService.login).toHaveBeenCalledWith(
      "jane@example.com",
      "secret123"
    );
    expect(setAccessToken).toHaveBeenLastCalledWith("login-token", 900);
    expect(result.current.user).toEqual(loggedInUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(getStoredUser()).toEqual(loggedInUser);
  });

  it("registers the user, logs in, and stores auth state", async () => {
    const registeredUser: UserDTO = {
      ...defaultUser,
      name: "Registered User"
    };

    vi.mocked(authService.register).mockResolvedValue(registeredUser);
    vi.mocked(authService.login).mockResolvedValue({
      accessToken: "registered-token",
      expiresIn: 1200
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: Wrapper
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.register(
        "Registered User",
        "new@example.com",
        "safePass123"
      );
    });

    expect(authService.register).toHaveBeenCalledWith({
      name: "Registered User",
      email: "new@example.com",
      password: "safePass123"
    });
    expect(authService.login).toHaveBeenCalledWith(
      "new@example.com",
      "safePass123"
    );
    expect(setAccessToken).toHaveBeenLastCalledWith("registered-token", 1200);
    expect(result.current.user).toEqual(registeredUser);
    expect(getStoredUser()).toEqual(registeredUser);
  });

  it("logs out even when the logout request fails", async () => {
    vi.mocked(authService.refreshTokens).mockResolvedValue({
      accessToken: "session-token",
      expiresIn: 1800
    });
    vi.mocked(authService.getMe).mockResolvedValue(defaultUser);
    vi.mocked(authService.logout).mockRejectedValue(new Error("logout failed"));

    const { result } = renderHook(() => useAuth(), {
      wrapper: Wrapper
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(clearAccessToken).toHaveBeenCalledTimes(1);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("updates the current user and syncs localStorage", async () => {
    vi.mocked(authService.refreshTokens).mockResolvedValue({
      accessToken: "session-token",
      expiresIn: 1800
    });
    vi.mocked(authService.getMe).mockResolvedValue(defaultUser);

    const updatedUser: UserDTO = {
      ...defaultUser,
      name: "Updated Name",
      avatarUrl: "https://cdn.example.com/avatar.png"
    };
    vi.mocked(authService.updateUser).mockResolvedValue(updatedUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: Wrapper
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateUser({
        name: "Updated Name",
        avatarUrl: "https://cdn.example.com/avatar.png"
      });
    });

    expect(authService.updateUser).toHaveBeenCalledWith({
      name: "Updated Name",
      avatarUrl: "https://cdn.example.com/avatar.png"
    });
    expect(result.current.user).toEqual(updatedUser);
    expect(getStoredUser()).toEqual(updatedUser);
  });
});
