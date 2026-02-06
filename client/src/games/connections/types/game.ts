import type { Author } from '@/types/shared';

export interface Category {
  name: string;
  words: string[];
  difficulty: 1 | 2 | 3 | 4;
}

export interface Puzzle {
  id: number;
  authors?: Author[];
  categories: Category[];
}

export interface DailyPuzzle extends Puzzle {
  date: string; // YYYY-MM-DD format
}

export interface DailyPuzzles {
  [date: string]: DailyPuzzle;
}

export interface CompletionData {
  date: string;
  completed: boolean;
  status: 'won' | 'lost';
  attempts: number;
  timestamp: string;
  guessHistory: number[][];
}

export type GameStatus = 'playing' | 'won' | 'lost';
