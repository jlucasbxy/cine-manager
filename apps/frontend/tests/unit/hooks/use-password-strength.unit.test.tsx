import { PasswordStrengthValidator } from "@repo/validators";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePasswordStrength } from "@/hooks/use-password-strength";

const validator = new PasswordStrengthValidator();

function getExpectedResult(password: string) {
  const evaluation = validator.check(password);
  return {
    score: evaluation.score,
    feedback: {
      warning: evaluation.feedback.warning?.toString() ?? "",
      suggestions: evaluation.feedback.suggestions?.map(String) ?? []
    },
    isLoading: false
  };
}

describe("usePasswordStrength", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns an empty result for empty password", () => {
    const { result, unmount } = renderHook(() => usePasswordStrength(""));

    expect(result.current).toEqual({
      score: 0,
      feedback: { warning: "", suggestions: [] },
      isLoading: false
    });

    unmount();
  });

  it("evaluates password after debounce delay", () => {
    let password = "";
    const { result, rerender, unmount } = renderHook(() =>
      usePasswordStrength(password)
    );

    password = "MovieFan123!";
    rerender();

    expect(result.current).toEqual({
      score: 0,
      feedback: { warning: "", suggestions: [] },
      isLoading: false
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(getExpectedResult(password));

    unmount();
  });
});
