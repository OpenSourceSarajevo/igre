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
    <div className="max-w-[600px] mx-auto px-4 flex flex-col">
      <header className="flex flex-col items-center mb-8 pt-4 text-center">
        <h1 className="font-inherit text-[2.5rem] font-extrabold m-0 text-[var(--text)] tracking-[-0.04em] leading-[1.1] sm:text-[1.8rem]">{currentGame.name}</h1>
        <div className="font-inherit text-base font-medium mt-1 text-[var(--text)] opacity-70">
          {currentPuzzle!.date.split('-').reverse().join('.') + '.'}
        </div>
        <p className="font-inherit text-[1.15rem] mt-6 font-normal text-[var(--text)] max-w-[400px] text-center sm:text-base">{currentGame.description}</p>
      </header>

      {gameStatus === "playing" && (
        <div className="flex items-center justify-center gap-3 mb-6 text-base text-[var(--text)]">
          <span>Preostali pokušaji:</span>
          <div className="flex gap-2">
            {Array.from({ length: MAX_MISTAKES - mistakes }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-[var(--tile-selected)] rounded-full" />
            ))}
          </div>
        </div>
      )}

      <div className="h-[50px] flex items-center justify-center mb-2">
        {feedbackMessage && <p className="bg-[var(--text)] text-[var(--bg)] px-4 py-2 rounded font-semibold text-[0.95rem] m-0 shadow-[0_4px_12px_rgba(0,0,0,0.2)] animate-toast-in">{feedbackMessage}</p>}
      </div>

      <div className="w-full">
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
          <div>
            <CategoryDisplay
              categories={currentPuzzle!.categories.filter(
                (c) => !foundCategories.find((f) => f.name === c.name),
              )}
            />

            <div className="flex flex-col gap-[10px] items-center mt-8">
              <button className="bg-[var(--text)] text-[var(--bg)] border-none px-6 py-3 rounded-[24px] font-bold cursor-pointer min-w-[180px]" onClick={() => setShowResults(true)}>
                Prikaži rezultate
              </button>
              <button className="bg-transparent text-[var(--text)] border border-[var(--header-border)] px-6 py-3 rounded-[24px] font-semibold cursor-pointer min-w-[180px]" onClick={initializeGame}>
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
        <div className="text-center text-[0.8rem] italic mt-12 opacity-50">
          Autor: {currentPuzzle.authors.map((a) => a.name).join(", ")}
        </div>
      )}
      <Footer />
    </div>
  );
}