import { renderHook } from "@testing-library/react";
import React, { type ContextType, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ThemeContext } from "@/contexts/theme-context";
import { useTheme } from "@/hooks/use-theme";

type ThemeContextValue = NonNullable<ContextType<typeof ThemeContext>>;

describe("useTheme", () => {
  it("throws when used outside ThemeProvider", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider"
    );

    consoleErrorSpy.mockRestore();
  });

  it("returns the theme context when provider exists", () => {
    const contextValue: ThemeContextValue = {
      theme: "dark",
      toggleTheme: vi.fn()
    };

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
      );
    }

    const { result, unmount } = renderHook(() => useTheme(), {
      wrapper: Wrapper
    });

    expect(result.current).toBe(contextValue);

    unmount();
  });
});
