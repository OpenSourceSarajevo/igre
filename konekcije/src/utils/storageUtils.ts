import type { CompletionData } from '../types/game';

const STORAGE_PREFIX = 'konekcije_';

export function hasCompletedToday(date: string): boolean {
  const key = `${STORAGE_PREFIX}completed_${date}`;
  return localStorage.getItem(key) !== null;
}

export function saveCompletion(
  date: string,
  status: 'won' | 'lost',
  attempts: number,
  guessHistory: number[][] // Add this parameter
): void {
  const key = `${STORAGE_PREFIX}completed_${date}`;
  const data: CompletionData = {
    date,
    completed: true,
    status,
    attempts,
    timestamp: new Date().toISOString(),
    guessHistory,
  };
  localStorage.setItem(key, JSON.stringify(data));
}

export function getCompletion(date: string): CompletionData | null {
  const key = `${STORAGE_PREFIX}completed_${date}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function clearCompletion(date: string): void {
  const key = `${STORAGE_PREFIX}completed_${date}`;
  localStorage.removeItem(key);
}
