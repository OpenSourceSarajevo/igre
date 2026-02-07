import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  hasCompletedToday,
  saveCompletion,
  getCompletion,
  clearCompletion,
} from "./storageUtils";

const mockStorage: Record<string, string> = {};

beforeEach(() => {
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);

  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => mockStorage[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      mockStorage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockStorage[key];
    }),
  });
});

describe("hasCompletedToday", () => {
  it("should return false when no completion exists", () => {
    expect(hasCompletedToday("2026-02-07")).toBe(false);
  });

  it("should return true when completion exists", () => {
    mockStorage["konekcije_completed_2026-02-07"] = "{}";
    expect(hasCompletedToday("2026-02-07")).toBe(true);
  });
});

describe("saveCompletion", () => {
  it("should save completion data to localStorage", () => {
    const guessHistory = [
      [1, 1, 1, 1],
      [2, 2, 2, 3],
    ];
    saveCompletion("2026-02-07", "won", 1, guessHistory);

    const stored = JSON.parse(mockStorage["konekcije_completed_2026-02-07"]);
    expect(stored.date).toBe("2026-02-07");
    expect(stored.completed).toBe(true);
    expect(stored.status).toBe("won");
    expect(stored.attempts).toBe(1);
    expect(stored.guessHistory).toEqual(guessHistory);
    expect(stored.timestamp).toBeDefined();
  });

  it("should save loss data correctly", () => {
    saveCompletion("2026-02-07", "lost", 4, [[1, 2, 3, 4]]);

    const stored = JSON.parse(mockStorage["konekcije_completed_2026-02-07"]);
    expect(stored.status).toBe("lost");
    expect(stored.attempts).toBe(4);
  });
});

describe("getCompletion", () => {
  it("should return null when no completion exists", () => {
    expect(getCompletion("2026-02-07")).toBeNull();
  });

  it("should return parsed completion data", () => {
    const data = {
      date: "2026-02-07",
      completed: true,
      status: "won",
      attempts: 2,
      timestamp: "2026-02-07T12:00:00.000Z",
      guessHistory: [[1, 1, 1, 1]],
    };
    mockStorage["konekcije_completed_2026-02-07"] = JSON.stringify(data);

    const result = getCompletion("2026-02-07");
    expect(result).toEqual(data);
  });
});

describe("clearCompletion", () => {
  it("should remove completion data from localStorage", () => {
    mockStorage["konekcije_completed_2026-02-07"] = "{}";
    clearCompletion("2026-02-07");
    expect(mockStorage["konekcije_completed_2026-02-07"]).toBeUndefined();
  });

  it("should not throw when clearing non-existent data", () => {
    expect(() => clearCompletion("2026-02-07")).not.toThrow();
  });
});
