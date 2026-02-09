import { useState, useCallback, useEffect } from "react";
import type {
  Category,
  GameStatus as GameStatusType,
  DailyPuzzle,
} from "../types/game";
import {
  shuffleArray,
  checkGuess,
  isGameWon,
  isGameLost,
  isOneAway,
} from "../utils/gameLogic";
import { getTodaysPuzzle, getPuzzleByDate } from "../utils/puzzleUtils";
import { saveCompletion, getCompletion } from "../utils/storageUtils";
import { currentGame } from "@/config/gameConfig";
import { WordGrid } from "./WordGrid";
import { CategoryDisplay } from "./CategoryDisplay";
import { GameControls } from "./GameControls";
import { ResultsModal } from "./ResultsModal";
import { Footer } from "@/components/Footer";
import "./Game.css";

const MAX_MISTAKES = 4;
const MAX_SELECTIONS = 4;

interface GameProps {
  forcedDate?: string;
}

export function Game({ forcedDate }: GameProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState<DailyPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [foundCategories, setFoundCategories] = useState<Category[]>([]);
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatusType>("playing");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [guessHistory, setGuessHistory] = useState<number[][]>([]);
  const [previousGuesses, setPreviousGuesses] = useState<string[][]>([]);

  const loadPuzzle = useCallback(async () => {
    setIsLoading(true);
    const puzzle = forcedDate
      ? await getPuzzleByDate(forcedDate)
      : await getTodaysPuzzle();
    setCurrentPuzzle(puzzle);

    if (puzzle) {
      const completion = getCompletion(puzzle.date);
      if (completion) {
        setGameStatus(completion.status);
        setMistakes(completion.attempts);
        setFoundCategories(puzzle.categories);
        setSelectedWords([]);
        setRemainingWords([]);
        setGuessHistory(completion.guessHistory || []);
        setShowResults(true);
      } else {
        const allWords = puzzle.categories.flatMap((cat) => cat.words);
        setRemainingWords(shuffleArray(allWords));
        setSelectedWords([]);
        setFoundCategories([]);
        setMistakes(0);
        setGameStatus("playing");
        setGuessHistory([]);
        setShowResults(false);
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
    setGameStatus("playing");
    setGuessHistory([]);
    setPreviousGuesses([]);
    setShowResults(false);
  }, [currentPuzzle]);

  const handleWordClick = (word: string) => {
    if (gameStatus !== "playing") return;
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else if (selectedWords.length < MAX_SELECTIONS) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleShuffle = () =>
    setRemainingWords(shuffleArray([...remainingWords]));
  const handleDeselectAll = () => setSelectedWords([]);

  const handleSubmit = () => {
    if (!currentPuzzle || gameStatus !== "playing") return;

    // Check for repeat guess
    const sortedSelected = [...selectedWords].sort().join(',');
    const isRepeat = previousGuesses.some(
      guess => [...guess].sort().join(',') === sortedSelected
    );

    if (isRepeat) {
      setFeedbackMessage("Već ste probali tu kombinaciju");
      setTimeout(() => setFeedbackMessage(""), 2000);
      return;
    }

    setPreviousGuesses(prev => [...prev, selectedWords]);

    const currentGuessLevels = selectedWords.map((word) => {
      const cat = currentPuzzle.categories.find((c) => c.words.includes(word));
      return cat ? cat.difficulty : 0;
    });

    const newHistory = [...guessHistory, currentGuessLevels];
    setGuessHistory(newHistory);

    const remainingCategories = currentPuzzle.categories.filter(
      (cat) => !foundCategories.find((found) => found.name === cat.name),
    );

    const matchedCategory = checkGuess(selectedWords, remainingCategories);

    if (matchedCategory) {
      const newFoundCategories = [...foundCategories, matchedCategory];
      setFoundCategories(newFoundCategories);
      setRemainingWords(
        remainingWords.filter((word) => !matchedCategory.words.includes(word)),
      );
      setSelectedWords([]);
      if (isGameWon(newFoundCategories, currentPuzzle.categories.length)) {
        setGameStatus("won");
        saveCompletion(currentPuzzle.date, "won", mistakes, newHistory);
        setTimeout(() => setShowResults(true), 1200);
      }
    } else {
      if (isOneAway(selectedWords, remainingCategories)) {
        setFeedbackMessage("Fali jedna...");
        setTimeout(() => setFeedbackMessage(""), 2000);
      }
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setSelectedWords([]);
      if (isGameLost(newMistakes, MAX_MISTAKES)) {
        setGameStatus("lost");
        saveCompletion(currentPuzzle.date, "lost", newMistakes, newHistory);
        setTimeout(() => setShowResults(true), 1200);
      }
    }
  };

  if (isLoading) return null; 

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">{currentGame.name}</h1>
        <div className="puzzle-date">
          {currentPuzzle!.date.split('-').reverse().join('.') + '.'}
        </div>
        <p className="game-instructions">{currentGame.description}</p>
      </header>

      {gameStatus === "playing" && (
        <div className="mistakes-counter">
          <span>Preostali pokušaji:</span>
          <div className="mistake-dots">
            {Array.from({ length: MAX_MISTAKES - mistakes }).map((_, i) => (
              <div key={i} className="mistake-dot" />
            ))}
          </div>
        </div>
      )}

      <div className="feedback-message">
        {feedbackMessage && <p>{feedbackMessage}</p>}
      </div>

      <div className="game-content">
        <CategoryDisplay categories={foundCategories} />

        {gameStatus === "playing" ? (
          <>
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
        ) : (
          <div className="post-game-view">
            <CategoryDisplay
              categories={currentPuzzle!.categories.filter(
                (c) => !foundCategories.find((f) => f.name === c.name),
              )}
            />

            <div className="end-game-buttons">
              <button className="primary-action-btn" onClick={() => setShowResults(true)}>
                Prikaži rezultate
              </button>
              <button className="secondary-action-btn" onClick={initializeGame}>
                Igraj ponovo
              </button>
            </div>
          </div>
        )}
      </div>

      {showResults && (
        <ResultsModal
          history={guessHistory}
          date={currentPuzzle!.date}
          status={gameStatus}
          onClose={() => setShowResults(false)}
          onNewGame={initializeGame}
        />
      )}

      {currentPuzzle?.authors && (
        <div className="footer-author">
          Autor: {currentPuzzle.authors.map((a) => a.name).join(", ")}
        </div>
      )}
      <Footer />
    </div>
  );
}