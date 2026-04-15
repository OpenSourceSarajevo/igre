import type { DailyPuzzle } from "../types/game";
import { getTodayDateString } from "@/utils/dateUtils";
import {
  getPuzzleByDateFromSupabase,
  getAllPublishedDatesFromSupabase,
} from "./supabasePuzzleUtils";

// Static fallback via Vite's import.meta.glob (used during migration window)
const puzzleModules = import.meta.glob<{ default: DailyPuzzle }>(
  "../data/puzzles/*.json",
  { eager: false },
);

function getStaticDates(): string[] {
  return Object.keys(puzzleModules)
    .map((path) => {
      const match = path.match(/(\d{4}-\d{2}-\d{2})\.json$/);
      return match ? match[1] : null;
    })
    .filter((date): date is string => date !== null)
    .sort((a, b) => b.localeCompare(a));
}

async function getPuzzleFromStaticFiles(date: string): Promise<DailyPuzzle | null> {
  const path = `../data/puzzles/${date}.json`;
  const loader = puzzleModules[path];

  if (!loader) return null;

  try {
    const module = await loader();
    return module.default;
  } catch (error) {
    console.error(`Failed to load puzzle for ${date}:`, error);
    return null;
  }
}

export async function getPuzzleByDate(date: string): Promise<DailyPuzzle | null> {
  const fromSupabase = await getPuzzleByDateFromSupabase(date);
  if (fromSupabase) return fromSupabase;

  return getPuzzleFromStaticFiles(date);
}

export async function getTodaysPuzzle(): Promise<DailyPuzzle | null> {
  const today = getTodayDateString();

  const todayPuzzle = await getPuzzleByDate(today);
  if (todayPuzzle) return todayPuzzle;

  return getMostRecentPuzzle(today);
}

async function getMostRecentPuzzle(beforeDate: string): Promise<DailyPuzzle | null> {
  const dates = await getAllPuzzleDates();
  const pastDates = dates.filter((date) => date < beforeDate);

  if (pastDates.length === 0) return null;

  // dates are sorted descending, so last item after filtering is the most recent past
  return getPuzzleByDate(pastDates[0]);
}

export async function getAllPuzzleDates(): Promise<string[]> {
  const today = getTodayDateString();

  const [supabaseDates, staticDates] = await Promise.all([
    getAllPublishedDatesFromSupabase(),
    Promise.resolve(getStaticDates()),
  ]);

  const merged = Array.from(new Set([...supabaseDates, ...staticDates]))
    .filter((date) => date <= today)
    .sort((a, b) => b.localeCompare(a));

  return merged;
}
