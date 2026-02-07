import { describe, it, expect, vi, afterEach } from "vitest";
import { getTodayDateString, formatDate, parseDate } from "./dateUtils";

describe("formatDate", () => {
  it("should format a date as YYYY-MM-DD", () => {
    const date = new Date(2026, 1, 7); // Feb 7, 2026
    expect(formatDate(date)).toBe("2026-02-07");
  });

  it("should pad single-digit months", () => {
    const date = new Date(2026, 0, 15); // Jan 15, 2026
    expect(formatDate(date)).toBe("2026-01-15");
  });

  it("should pad single-digit days", () => {
    const date = new Date(2026, 11, 5); // Dec 5, 2026
    expect(formatDate(date)).toBe("2026-12-05");
  });

  it("should handle year boundaries", () => {
    const date = new Date(2025, 11, 31); // Dec 31, 2025
    expect(formatDate(date)).toBe("2025-12-31");
  });
});

describe("getTodayDateString", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return today date in YYYY-MM-DD format", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 7));
    expect(getTodayDateString()).toBe("2026-02-07");
  });

  it("should reflect the actual system date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 5, 15));
    expect(getTodayDateString()).toBe("2025-06-15");
  });
});

describe("parseDate", () => {
  it("should parse a YYYY-MM-DD string into a Date", () => {
    const result = parseDate("2026-02-07");
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1); // 0-indexed
    expect(result.getDate()).toBe(7);
  });
});
