import { renderHook } from "@testing-library/react";
import React, { type ContextType, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/use-auth";

type AuthContextValue = NonNullable<ContextType<typeof AuthContext>>;

describe("useAuth", () => {
  it("throws when used outside AuthProvider", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider"
    );

    consoleErrorSpy.mockRestore();
  });

  it("returns the auth context when provider exists", () => {
    const contextValue: AuthContextValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn()
    };

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
      );
    }

    const { result } = renderHook(() => useAuth(), {
      wrapper: Wrapper
    });

    expect(result.current).toBe(contextValue);
  });
});
