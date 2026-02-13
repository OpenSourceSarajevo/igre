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
import {
  saveCompletion,
  getCompletion,
  saveInProgress,
  getInProgress,
  clearInProgress,
} from "../utils/storageUtils";
import { currentGame } from "@/config/gameConfig";
import { WordGrid } from "./WordGrid";
import { CategoryDisplay } from "./CategoryDisplay";
import { GameControls } from "./GameControls";
import { ResultsModal } from "./ResultsModal";
import Toast from "./Toast";

interface Guess {
  words: string[];
  levels: number[];
}

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
  const [guessHistory, setGuessHistory] = useState<Guess[]>([]);
  const [shakeSelected, setShakeSelected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPuzzle() {
      setIsLoading(true);
      try {
        const puzzle = forcedDate
          ? await getPuzzleByDate(forcedDate)
          : await getTodaysPuzzle();

        if (cancelled) return;

        setCurrentPuzzle(puzzle);

        if (puzzle) {
          const completion = getCompletion(puzzle.date);
          if (completion) {
            setGameStatus(completion.status);
            setMistakes(completion.attempts);
            setFoundCategories(puzzle.categories);
            setSelectedWords([]);
            setRemainingWords([]);
            setGuessHistory(
              (completion.guessHistory || []).map((levels) => ({
                words: [],
                levels,
              })),
            );
            setShowResults(true);
          } else {
            const progress = getInProgress(puzzle.date);
            if (progress) {
              setMistakes(progress.mistakes);
              setFoundCategories(
                puzzle.categories.filter((cat) =>
                  progress.foundCategoryNames.includes(cat.name),
                ),
              );
              setGuessHistory(progress.guessHistory);
              setRemainingWords(progress.remainingWords);
              setSelectedWords([]);
              setGameStatus("playing");
              setShowResults(false);
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
        }
      } catch (error) {
        console.error("Greška pri učitavanju zagonetke:", error);
        if (!cancelled) setCurrentPuzzle(null);
      }
      if (!cancelled) setIsLoading(false);
    }

    loadPuzzle();

    return () => {
      cancelled = true;
    };
  }, [forcedDate]);

  const initializeGame = useCallback(() => {
    if (!currentPuzzle) return;
    clearInProgress(currentPuzzle.date);
    const allWords = currentPuzzle.categories.flatMap((cat) => cat.words);
    setRemainingWords(shuffleArray(allWords));
    setSelectedWords([]);
    setFoundCategories([]);
    setMistakes(0);
    setGameStatus("playing");
    setGuessHistory([]);
    setShowResults(false);
    setShakeSelected(false);
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

    const sortedSelected = [...selectedWords].sort().join(",");
    const isRepeat = guessHistory.some(
      (guess) => [...guess.words].sort().join(",") === sortedSelected,
    );

    if (isRepeat) {
      setFeedbackMessage("Već ste probali tu kombinaciju");
      return;
    }

    const currentGuessLevels = selectedWords.map((word) => {
      const cat = currentPuzzle.categories.find((c) => c.words.includes(word));
      return cat ? cat.difficulty : 0;
    });

    const newHistory = [
      ...guessHistory,
      { words: [...selectedWords], levels: currentGuessLevels },
    ];
    setGuessHistory(newHistory);

    const remainingCategories = currentPuzzle.categories.filter(
      (cat) => !foundCategories.find((found) => found.name === cat.name),
    );

    const matchedCategory = checkGuess(selectedWords, remainingCategories);

    if (matchedCategory) {
      setShakeSelected(false);
      const newFoundCategories = [...foundCategories, matchedCategory];
      setFoundCategories(newFoundCategories);
      const newRemainingWords = remainingWords.filter(
        (word) => !matchedCategory.words.includes(word),
      );
      setRemainingWords(newRemainingWords);
      setSelectedWords([]);
      if (isGameWon(newFoundCategories, currentPuzzle.categories.length)) {
        setGameStatus("won");
        clearInProgress(currentPuzzle.date);
        saveCompletion(
          currentPuzzle.date,
          "won",
          mistakes,
          newHistory.map((g) => g.levels),
        );
        setTimeout(() => setShowResults(true), 1200);
      } else {
        saveInProgress(currentPuzzle.date, {
          mistakes,
          foundCategoryNames: newFoundCategories.map((c) => c.name),
          guessHistory: newHistory,
          remainingWords: newRemainingWords,
        });
      }
    } else {
      setShakeSelected(true);
      setTimeout(() => setShakeSelected(false), 400);

      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (isOneAway(selectedWords, remainingCategories)) {
        setFeedbackMessage("Fali jedna...");
        setTimeout(() => setFeedbackMessage(""), 2000);
      }
      if (isGameLost(newMistakes, MAX_MISTAKES)) {
        setGameStatus("lost");
        clearInProgress(currentPuzzle.date);
        saveCompletion(
          currentPuzzle.date,
          "lost",
          newMistakes,
          newHistory.map((g) => g.levels),
        );
        setTimeout(() => setShowResults(true), 1200);
      } else {
        saveInProgress(currentPuzzle.date, {
          mistakes: newMistakes,
          foundCategoryNames: foundCategories.map((c) => c.name),
          guessHistory: newHistory,
          remainingWords,
        });
      }
    }
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 mx-auto px-4 w-full">
        {!currentPuzzle ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="font-inherit text-[2.5rem] font-extrabold mb-2 text-app-text tracking-[-0.04em]">
              {currentGame.name}
            </h1>
            <p className="text-app-text opacity-70 text-lg">
              Zagonetka za ovaj datum još nije dostupna.
            </p>
            <p className="text-app-text opacity-50 mt-2">
              Provjerite arhivu za prethodne dane.
            </p>
          </div>
        ) : (
          <>
            <header className="flex flex-col items-center mb-8 pt-4 text-center">
              <h1 className="font-inherit text-[2.5rem] font-extrabold m-0 text-app-text tracking-[-0.04em] leading-[1.1] sm:text-[1.8rem]">
                {currentGame.name}
              </h1>
              <div className="font-inherit text-base font-medium mt-1 text-app-text opacity-70">
                {currentPuzzle.date.split("-").reverse().join(".") + "."}
              </div>
              <p className="font-inherit mt-6 font-normal text-app-text max-w-[400px] text-center text-sm sm:text-base md:text-lg">
                {currentGame.description}
              </p>
            </header>

            <div className="w-full relative">
              <Toast
                message={feedbackMessage}
                onClose={() => setFeedbackMessage("")}
              />

              <CategoryDisplay categories={foundCategories} />

              {gameStatus === "playing" ? (
                <>
                  <WordGrid
                    words={remainingWords}
                    selectedWords={selectedWords}
                    onWordClick={handleWordClick}
                    disabled={false}
                    shakeSelected={shakeSelected}
                  />
                  <GameControls
                    onShuffle={handleShuffle}
                    onDeselectAll={handleDeselectAll}
                    onSubmit={handleSubmit}
                    canSubmit={selectedWords.length === MAX_SELECTIONS}
                    canDeselect={selectedWords.length > 0}
                    disabled={false}
                  />

                  <div className="flex items-center justify-center gap-3 mb-6 text-base text-app-text">
                    <span>Preostali pokušaji:</span>
                    <div className="flex gap-2">
                      {Array.from({ length: MAX_MISTAKES - mistakes }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-tile-selected rounded-full"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <CategoryDisplay
                    categories={currentPuzzle.categories.filter(
                      (c) => !foundCategories.find((f) => f.name === c.name),
                    )}
                  />

                  <div className="flex flex-col gap-[10px] items-center mt-8">
                    <button
                      className="bg-app-text text-app-bg  border-none px-6 py-3 rounded-[24px] font-bold cursor-pointer min-w-[180px] hover:opacity-90 transition-opacity"
                      onClick={() => setShowResults(true)}
                    >
                      Prikaži rezultate
                    </button>
                    <button
                      className="bg-transparent text-app-text border border-header-border px-6 py-3 rounded-[24px] font-semibold cursor-pointer min-w-[180px] hover:bg-tile-bg transition-colors"
                      onClick={initializeGame}
                    >
                      Igraj ponovo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {showResults && (
              <ResultsModal
                history={guessHistory.map((g) => g.levels)}
                date={currentPuzzle.date}
                status={gameStatus}
                onClose={() => setShowResults(false)}
                onNewGame={initializeGame}
              />
            )}

            {currentPuzzle.authors && currentPuzzle.authors.length > 0 && (
              <div className="text-center text-[0.8rem] italic mt-12 mb-8 opacity-50">
                Autor: {currentPuzzle.authors.map((a) => a.name).join(", ")}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
