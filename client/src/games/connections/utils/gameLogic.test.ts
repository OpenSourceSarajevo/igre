import { describe, it, expect } from "vitest";
import {
  shuffleArray,
  checkGuess,
  isOneAway,
  isGameWon,
  isGameLost,
} from "./gameLogic";
import type { Category } from "../types/game";

const mockCategories: Category[] = [
  {
    name: "Voće",
    words: ["Jabuka", "Kruška", "Banana", "Narandža"],
    difficulty: 1,
  },
  { name: "Boje", words: ["Crvena", "Plava", "Zelena", "Žuta"], difficulty: 2 },
  {
    name: "Gradovi",
    words: ["Sarajevo", "Mostar", "Tuzla", "Zenica"],
    difficulty: 3,
  },
  {
    name: "Rijeke",
    words: ["Bosna", "Neretva", "Drina", "Una"],
    difficulty: 4,
  },
];

describe("shuffleArray", () => {
  it("should return an array of the same length", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
  });

  it("should contain all original elements", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it("should not mutate the original array", () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffleArray(input);
    expect(input).toEqual(copy);
  });

  it("should handle an empty array", () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it("should handle a single element array", () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});

describe("checkGuess", () => {
  it("should return the matching category for a correct guess", () => {
    const result = checkGuess(
      ["Jabuka", "Kruška", "Banana", "Narandža"],
      mockCategories,
    );
    expect(result).toEqual(mockCategories[0]);
  });

  it("should match regardless of word order", () => {
    const result = checkGuess(
      ["Narandža", "Banana", "Jabuka", "Kruška"],
      mockCategories,
    );
    expect(result).toEqual(mockCategories[0]);
  });

  it("should return null for an incorrect guess", () => {
    const result = checkGuess(
      ["Jabuka", "Kruška", "Banana", "Crvena"],
      mockCategories,
    );
    expect(result).toBeNull();
  });

  it("should return null for an empty selection", () => {
    const result = checkGuess([], mockCategories);
    expect(result).toBeNull();
  });

  it("should work with any category", () => {
    const result = checkGuess(
      ["Bosna", "Neretva", "Drina", "Una"],
      mockCategories,
    );
    expect(result).toEqual(mockCategories[3]);
  });
});

describe("isOneAway", () => {
  it("should return true when 3 out of 4 words match a category", () => {
    const result = isOneAway(
      ["Jabuka", "Kruška", "Banana", "Crvena"],
      mockCategories,
    );
    expect(result).toBe(true);
  });

  it("should return false when only 2 words match", () => {
    const result = isOneAway(
      ["Jabuka", "Kruška", "Crvena", "Plava"],
      mockCategories,
    );
    expect(result).toBe(false);
  });

  it("should return false when all 4 match (that would be a correct guess)", () => {
    const result = isOneAway(
      ["Jabuka", "Kruška", "Banana", "Narandža"],
      mockCategories,
    );
    expect(result).toBe(false);
  });

  it("should return false when no words match any category well", () => {
    const result = isOneAway(
      ["Jabuka", "Crvena", "Sarajevo", "Bosna"],
      mockCategories,
    );
    expect(result).toBe(false);
  });

  it("should detect one-away across different categories", () => {
    const result = isOneAway(
      ["Sarajevo", "Mostar", "Tuzla", "Bosna"],
      mockCategories,
    );
    expect(result).toBe(true);
  });
});

describe("isGameWon", () => {
  it("should return true when all categories are found", () => {
    expect(isGameWon(mockCategories, 4)).toBe(true);
  });

  it("should return false when not all categories are found", () => {
    expect(isGameWon([mockCategories[0], mockCategories[1]], 4)).toBe(false);
  });

  it("should return false when no categories are found", () => {
    expect(isGameWon([], 4)).toBe(false);
  });
});

describe("isGameLost", () => {
  it("should return true when mistakes reach max", () => {
    expect(isGameLost(4, 4)).toBe(true);
  });

  it("should return true when mistakes exceed max", () => {
    expect(isGameLost(5, 4)).toBe(true);
  });

  it("should return false when mistakes are below max", () => {
    expect(isGameLost(3, 4)).toBe(false);
  });

  it("should return false with zero mistakes", () => {
    expect(isGameLost(0, 4)).toBe(false);
  });
});
