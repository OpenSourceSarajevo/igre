import { useState, useEffect } from 'react';
import type { Category, GameStatus as GameStatusType } from '../types/game';
import { puzzle } from '../data/puzzles';
import { shuffleArray, checkGuess, isGameWon, isGameLost } from '../utils/gameLogic';
import { WordGrid } from './WordGrid';
import { CategoryDisplay } from './CategoryDisplay';
import { GameControls } from './GameControls';
import { GameStatus } from './GameStatus';
import './Game.css';

const MAX_MISTAKES = 4;
const MAX_SELECTIONS = 4;

export function Game() {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [foundCategories, setFoundCategories] = useState<Category[]>([]);
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatusType>('playing');

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const allWords = puzzle.categories.flatMap((cat) => cat.words);
    setRemainingWords(shuffleArray(allWords));
    setSelectedWords([]);
    setFoundCategories([]);
    setMistakes(0);
    setGameStatus('playing');
  };

  const handleWordClick = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      if (selectedWords.length < MAX_SELECTIONS) {
        setSelectedWords([...selectedWords, word]);
      }
    }
  };

  const handleSubmit = () => {
    const remainingCategories = puzzle.categories.filter(
      (cat) => !foundCategories.includes(cat)
    );

    const matchedCategory = checkGuess(selectedWords, remainingCategories);

    if (matchedCategory) {
      const newFoundCategories = [...foundCategories, matchedCategory];
      setFoundCategories(newFoundCategories);
      setRemainingWords(
        remainingWords.filter((word) => !matchedCategory.words.includes(word))
      );
      setSelectedWords([]);

      if (isGameWon(newFoundCategories, puzzle.categories.length)) {
        setGameStatus('won');
      }
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setSelectedWords([]);

      if (isGameLost(newMistakes, MAX_MISTAKES)) {
        setGameStatus('lost');
      }
    }
  };

  const handleShuffle = () => {
    setRemainingWords(shuffleArray([...remainingWords]));
  };

  const handleDeselectAll = () => {
    setSelectedWords([]);
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Konekcije</h1>
        <p>Pronađi četiri grupe od po četiri povezane riječi</p>
      </header>

      <GameStatus
        mistakes={mistakes}
        maxMistakes={MAX_MISTAKES}
        gameStatus={gameStatus}
        onNewGame={initializeGame}
      />

      {gameStatus === 'playing' && (
        <>
          <CategoryDisplay categories={foundCategories} />

          <WordGrid
            words={remainingWords}
            selectedWords={selectedWords}
            onWordClick={handleWordClick}
            disabled={false}
          />

          <GameControls
            onShuffle={handleShuffle}
            onDeselectAll={handleDeselectAll}
            onSubmit={handleSubmit}
            canSubmit={selectedWords.length === MAX_SELECTIONS}
            canDeselect={selectedWords.length > 0}
            disabled={false}
          />
        </>
      )}

      {gameStatus !== 'playing' && (
        <CategoryDisplay categories={foundCategories} />
      )}
    </div>
  );
}
