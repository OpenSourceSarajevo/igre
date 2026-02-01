import { useState, useCallback, useEffect } from 'react';
import type { Category, GameStatus as GameStatusType, DailyPuzzle } from '../types/game';
import { shuffleArray, checkGuess, isGameWon, isGameLost, isOneAway } from '../utils/gameLogic';
import { getTodaysPuzzle } from '../utils/puzzleUtils';
import { hasCompletedToday, saveCompletion, getCompletion } from '../utils/storageUtils';
import { WordGrid } from './WordGrid';
import { CategoryDisplay } from './CategoryDisplay';
import { GameControls } from './GameControls';
import { GameStatus } from './GameStatus';
import { DevControls } from './DevControls';
import { Footer } from './Footer';
import './Game.css';

const MAX_MISTAKES = 4;
const MAX_SELECTIONS = 4;

export function Game() {
  const [currentPuzzle, setCurrentPuzzle] = useState<DailyPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [foundCategories, setFoundCategories] = useState<Category[]>([]);
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatusType>('playing');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const loadPuzzle = useCallback(async () => {
    setIsLoading(true);
    const puzzle = await getTodaysPuzzle();
    setCurrentPuzzle(puzzle);

    if (puzzle) {
      const completed = hasCompletedToday(puzzle.date);
      setIsCompleted(completed);

      if (!completed) {
        // Initialize game with shuffled words
        const allWords = puzzle.categories.flatMap((cat) => cat.words);
        setRemainingWords(shuffleArray(allWords));
        setSelectedWords([]);
        setFoundCategories([]);
        setMistakes(0);
        setGameStatus('playing');
      } else {
        // If already completed, show the solution
        const completion = getCompletion(puzzle.date);
        if (completion) {
          setGameStatus(completion.status);
          setMistakes(completion.attempts);
          setFoundCategories(puzzle.categories);
          setSelectedWords([]);
          setRemainingWords([]);
        }
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadPuzzle();
  }, [loadPuzzle]);

  const initializeGame = useCallback(() => {
    if (!currentPuzzle) return;

    const allWords = currentPuzzle.categories.flatMap((cat) => cat.words);
    setRemainingWords(shuffleArray(allWords));
    setSelectedWords([]);
    setFoundCategories([]);
    setMistakes(0);
    setGameStatus('playing');
  }, [currentPuzzle]);

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
    if (!currentPuzzle) return;

    const remainingCategories = currentPuzzle.categories.filter(
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
      setFeedbackMessage('');

      if (isGameWon(newFoundCategories, currentPuzzle.categories.length)) {
        setGameStatus('won');
        saveCompletion(currentPuzzle.date, 'won', mistakes);
        setIsCompleted(true);
      }
    } else {
      // Check if the user is one away
      if (isOneAway(selectedWords, remainingCategories)) {
        setFeedbackMessage('Fali jedna...');
        setTimeout(() => setFeedbackMessage(''), 2000);
      } else {
        setFeedbackMessage('');
      }

      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setSelectedWords([]);

      if (isGameLost(newMistakes, MAX_MISTAKES)) {
        setGameStatus('lost');
        saveCompletion(currentPuzzle.date, 'lost', newMistakes);
        setIsCompleted(true);
      }
    }
  };

  const handleShuffle = () => {
    setRemainingWords(shuffleArray([...remainingWords]));
  };

  const handleDeselectAll = () => {
    setSelectedWords([]);
  };

  if (isLoading) {
    return (
      <div className="game-container">
        <header className="game-header">
          <h1>Konekcije</h1>
          <p>Učitavanje...</p>
        </header>
      </div>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="game-container">
        <header className="game-header">
          <h1>Konekcije</h1>
          <p>Nema dostupnih zagonetki. Molimo pokušajte kasnije.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="game-container">
      <DevControls onDateChange={loadPuzzle} />

      <header className="game-header">
        <h1>Konekcije</h1>
        <p>Pronađi četiri grupe od po četiri povezane riječi</p>
      </header>

      {isCompleted && gameStatus === 'playing' && (
        <div className="completion-banner">
          <p>Već ste završili današnju zagonetku!</p>
        </div>
      )}

      <GameStatus
        mistakes={mistakes}
        maxMistakes={MAX_MISTAKES}
        gameStatus={gameStatus}
        onNewGame={initializeGame}
      />

      {feedbackMessage && (
        <div className="feedback-message">
          <p>{feedbackMessage}</p>
        </div>
      )}

      {gameStatus === 'playing' && !isCompleted && (
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

      {(gameStatus !== 'playing' || isCompleted) && (
        <CategoryDisplay categories={foundCategories} />
      )}

      <Footer />
    </div>
  );
}
