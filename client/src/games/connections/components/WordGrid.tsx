import WordTile from "./WordTile";
import { cn } from "@/utils/classNameUtils";

interface WordGridProps {
  words: string[];
  selectedWords: string[];
  onWordClick: (word: string) => void;
  disabled?: boolean;
  shakeSelected?: boolean; // parent tells selected tiles to shake
}

export const WordGrid = ({
  words,
  selectedWords,
  onWordClick,
  disabled = false,
  shakeSelected = false,
}: WordGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-4",
        "gap-2 sm:gap-3",
        "mx-auto",
        "w-[95vw] sm:w-[630px]",
      )}
    >
      {words.map((word) => (
        <WordTile
          key={word}
          word={word}
          selected={selectedWords.includes(word)}
          onClick={onWordClick}
          disabled={disabled}
          shake={shakeSelected && selectedWords.includes(word)}
        />
      ))}
    </div>
  );
};
