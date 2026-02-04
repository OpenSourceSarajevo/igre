import type { DailyPuzzle } from '../types/game';
import { getTodayDateString } from './dateUtils';

// Use Vite's import.meta.glob to get all puzzle files
const puzzleModules = import.meta.glob<{ default: DailyPuzzle }>(
  '../data/puzzles/*.json',
  { eager: false }
);

// Extract dates from file paths
function getAvailableDates(): string[] {
  return Object.keys(puzzleModules)
    .map((path) => {
      const match = path.match(/(\d{4}-\d{2}-\d{2})\.json$/);
      return match ? match[1] : null;
    })
    .filter((date): date is string => date !== null)
    .sort((a, b) => b.localeCompare(a)); // newest date first
}

export async function getTodaysPuzzle(): Promise<DailyPuzzle | null> {
  const today = getTodayDateString();

  // Try to load today's puzzle
  const todayPuzzle = await getPuzzleByDate(today);
  if (todayPuzzle) {
    return todayPuzzle;
  }

  // Fallback: most recent puzzle before today
  return getMostRecentPuzzle(today);
}

export async function getPuzzleByDate(date: string): Promise<DailyPuzzle | null> {
  const path = `../data/puzzles/${date}.json`;
  const loader = puzzleModules[path];

  if (!loader) {
    return null;
  }

  try {
    const module = await loader();
    return module.default;
  } catch (error) {
    console.error(`Failed to load puzzle for ${date}:`, error);
    return null;
  }
}

async function getMostRecentPuzzle(beforeDate: string): Promise<DailyPuzzle | null> {
  const dates = getAvailableDates();
  const pastDates = dates.filter((date) => date < beforeDate);

  if (pastDates.length === 0) {
    return null;
  }

  const mostRecentDate = pastDates[pastDates.length - 1];
  return getPuzzleByDate(mostRecentDate);
}

export function getAllPuzzleDates(): string[] {
  return getAvailableDates();
}
