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

export type GameStatus = 'playing' | 'won' | 'lost';
