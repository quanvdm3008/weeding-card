// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCountdown } from "../useCountdown";

describe("useCountdown", () => {
  it("countdown to a future date with a positive number", () => {
    const future = new Date(Date.now() + 3 * 86_400_000); /* +3 days*/
    const date = future.toISOString().slice(0, 10);
    const { result, unmount } = renderHook(() => useCountdown(date, "12:00"));
    expect(result.current.days).toBeGreaterThanOrEqual(2);
    unmount();
  });

  it("DATE PASSED does not crash and returns 0 (regression: TDZ clearInterval before id initializes)", () => {
    /* Old bug: tick() runs synchronously upon mount; with date past branch diff<=0*/
    /* Call clearInterval(id) when `const id` has not been initialized → ReferenceError turns the entire card page blank.*/
    const { result, unmount } = renderHook(() => useCountdown("2025-12-20", "17:30"));
    expect(result.current).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    unmount();
  });

  it("Invalid date returns 0, no crash", () => {
    const { result, unmount } = renderHook(() => useCountdown("not-a-day", "17:30"));
    expect(result.current).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    unmount();
  });
});
