import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "@/hooks/use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result, unmount } = renderHook(() => useDebounce("initial", 300));

    expect(result.current).toBe("initial");

    unmount();
  });

  it("updates only after the configured delay", () => {
    let value = "a";
    const { result, rerender, unmount } = renderHook(() =>
      useDebounce(value, 300)
    );

    expect(result.current).toBe("a");

    value = "ab";
    rerender();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("ab");

    unmount();
  });

  it("resets the pending timer when value changes quickly", () => {
    let value = "first";
    const { result, rerender, unmount } = renderHook(() =>
      useDebounce(value, 300)
    );

    value = "second";
    rerender();

    act(() => {
      vi.advanceTimersByTime(150);
    });

    value = "third";
    rerender();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("third");

    unmount();
  });
});
