import type { DailyPuzzle } from "../types/game";
import { getTodayDateString } from "@/utils/dateUtils";
import {
  getPuzzleByDateFromSupabase,
  getAllPublishedDatesFromSupabase,
} from "./supabasePuzzleUtils";

export async function getPuzzleByDate(date: string): Promise<DailyPuzzle | null> {
  return getPuzzleByDateFromSupabase(date);
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

  return getPuzzleByDate(pastDates[0]);
}

export async function getAllPuzzleDates(): Promise<string[]> {
  const today = getTodayDateString();
  const dates = await getAllPublishedDatesFromSupabase();
  return dates.filter((date) => date <= today);
}
