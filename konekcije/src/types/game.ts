export interface Category {
  name: string;
  words: string[];
  difficulty: 1 | 2 | 3 | 4;
  color: string;
}

export interface Puzzle {
  id: number;
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
}

export type GameStatus = 'playing' | 'won' | 'lost';
