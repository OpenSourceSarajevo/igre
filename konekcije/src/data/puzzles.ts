import type { Puzzle } from '../types/game';

export const puzzle: Puzzle = {
  id: 1,
  categories: [
    {
      name: 'Gradovi u Bosni i Hercegovini',
      words: ['Sarajevo', 'Mostar', 'Tuzla', 'Banja Luka'],
      difficulty: 1,
      color: '#a8dadc',
    },
    {
      name: 'Voće',
      words: ['Jabuka', 'Kruška', 'Šljiva', 'Trešnja'],
      difficulty: 2,
      color: '#b8e6b8',
    },
    {
      name: 'Rijeke',
      words: ['Drina', 'Bosna', 'Una', 'Neretva'],
      difficulty: 3,
      color: '#ffd6a5',
    },
    {
      name: 'Riječi koje mogu slijediti "Kafa"',
      words: ['Sa', 'Bez', 'Crna', 'Topla'],
      difficulty: 4,
      color: '#d8b4fe',
    },
  ],
};
