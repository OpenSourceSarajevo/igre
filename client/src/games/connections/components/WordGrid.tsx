import { cn } from "@/utils/classNameUtils";

interface WordGridProps {
  words: string[];
  selectedWords: string[];
  onWordClick: (word: string) => void;
  disabled: boolean;
}

export function WordGrid({
  words,
  selectedWords,
  onWordClick,
  disabled,
}: WordGridProps) {
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
        <button
          key={word}
          className={cn(
            "aspect-[3/2] w-full",
            "flex items-center justify-center text-center",
            "text-sm sm:text-lg md:text-xl",
            "font-bold uppercase tracking-wide",
            "p-1 rounded-md",
            "cursor-pointer transition-all duration-200",
            "border-none hover:brightness-95 active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-50",
            {
              "bg-tile-selected text-white border-tile-selected":
                selectedWords.includes(word),
              "bg-tile-bg text-app-text": !selectedWords.includes(word),
            },
          )}
          onClick={() => onWordClick(word)}
          disabled={disabled}
        >
          {word.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
