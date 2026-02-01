import type { Category } from '../types/game';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function checkGuess(
  selectedWords: string[],
  categories: Category[]
): Category | null {
  for (const category of categories) {
    const sortedCategoryWords = [...category.words].sort();
    const sortedSelectedWords = [...selectedWords].sort();

    if (JSON.stringify(sortedCategoryWords) === JSON.stringify(sortedSelectedWords)) {
      return category;
    }
  }
  return null;
}

export function isOneAway(
  selectedWords: string[],
  categories: Category[]
): boolean {
  for (const category of categories) {
    const matchCount = selectedWords.filter(word =>
      category.words.includes(word)
    ).length;

    if (matchCount === 3) {
      return true;
    }
  }
  return false;
}

export function isGameWon(foundCategories: Category[], totalCategories: number): boolean {
  return foundCategories.length === totalCategories;
}

export function isGameLost(mistakes: number, maxMistakes: number): boolean {
  return mistakes >= maxMistakes;
}
