import { useState, useCallback, useEffect } from 'react';
import type { Category, GameStatus as GameStatusType, DailyPuzzle } from '../types/game';
import { shuffleArray, checkGuess, isGameWon, isGameLost, isOneAway } from '../utils/gameLogic';
import { getTodaysPuzzle, getPuzzleByDate } from '../utils/puzzleUtils';
import { saveCompletion, getCompletion } from '../utils/storageUtils';
import { WordGrid } from './WordGrid';
import { CategoryDisplay } from './CategoryDisplay';
import { GameControls } from './GameControls';
import { GameStatus } from './GameStatus';
import { DevControls } from './DevControls';
import { Footer } from './Footer';
import './Game.css';

const MAX_MISTAKES = 4;
const MAX_SELECTIONS = 4;

interface GameProps {
  forcedDate?: string;
}

export function Game({ forcedDate }: GameProps) {
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
  
    const puzzle = forcedDate 
      ? await getPuzzleByDate(forcedDate) 
      : await getTodaysPuzzle();

    setCurrentPuzzle(puzzle);

    if (puzzle) {
      const completion = getCompletion(puzzle.date);
      
      if (completion) {
        setIsCompleted(true);
        setGameStatus(completion.status);
        setMistakes(completion.attempts);
        setFoundCategories(puzzle.categories);
        setSelectedWords([]);
        setRemainingWords([]);
      } else {
        const allWords = puzzle.categories.flatMap((cat) => cat.words);
        setIsCompleted(false);
        setRemainingWords(shuffleArray(allWords));
        setSelectedWords([]);
        setFoundCategories([]);
        setMistakes(0);
        setGameStatus('playing');
      }
    }

    setIsLoading(false);
  }, [forcedDate]);

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
    setIsCompleted(false);
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
      (cat) => !foundCategories.find(found => found.name === cat.name)
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
      if (isOneAway(selectedWords, remainingCategories)) {
        setFeedbackMessage('Fali jedna...');
        setTimeout(() => setFeedbackMessage(''), 2000);
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
          <p>Nema dostupnih zagonetki.</p>
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
        <div className="puzzle-metadata">
    {forcedDate && (
      <p>
        Zagonetka od: {forcedDate.split('-').reverse().join('/')}
      </p>
    )}
    
    {currentPuzzle?.authors && currentPuzzle.authors.length > 0 && (
      <p className="author-text">
        Autor: {currentPuzzle.authors.map(a => a.name).join(', ')}
      </p>
    )}
  </div>
      </header>

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
        <CategoryDisplay categories={currentPuzzle.categories} />
      )}

      <Footer />
    </div>
  );
}