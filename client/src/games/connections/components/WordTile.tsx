import React from "react";
import clsx from "clsx";

export interface WordTileProps {
  word: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: (word: string) => void;
  shake?: boolean; // triggers shake animation
}

function getTextSizeClass(word: string): string {
  const len = word.length;
  if (len <= 6) return "text-sm sm:text-lg md:text-xl";
  if (len <= 10) return "text-xs sm:text-base md:text-lg";
  return "text-[0.6rem] sm:text-sm md:text-base";
}

export const WordTile: React.FC<WordTileProps> = ({
  word,
  selected = false,
  disabled = false,
  onClick,
  shake = false,
}) => {
  return (
    <button
      type="button"
      onClick={() => onClick(word)}
      disabled={disabled}
      className={clsx(
        "aspect-[3/1.75] w-full",
        "flex items-center justify-center text-center",
        getTextSizeClass(word),
        "font-bold uppercase tracking-wide leading-tight",
        "p-2 sm:p-3 rounded-md overflow-hidden",
        "cursor-pointer transition-all duration-200",
        "border-none hover:brightness-95 active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "bg-tile-selected text-white border-tile-selected"
          : "bg-tile-bg text-app-text",
        shake && "animate-shake",
      )}
    >
      {word.toUpperCase()}
    </button>
  );
};

export default WordTile;
