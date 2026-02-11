import { describe, it, expect } from "vitest";
import { difficultyColors } from "./colors";

describe("difficultyColors", () => {
  it("should have colors for all 4 difficulty levels", () => {
    expect(difficultyColors[1]).toBeDefined();
    expect(difficultyColors[2]).toBeDefined();
    expect(difficultyColors[3]).toBeDefined();
    expect(difficultyColors[4]).toBeDefined();
  });
  /*
  it("should have valid hex color values", () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    Object.values(difficultyColors).forEach((color) => {
      expect(color).toMatch(hexPattern);
    });
  });
*/
  it("should have unique colors for each difficulty", () => {
    const colors = Object.values(difficultyColors);
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
  });
});
