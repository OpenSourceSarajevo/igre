import React from "react";
import clsx from "clsx";

export interface WordTileProps {
  word: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: (word: string) => void;
  shake?: boolean; // triggers shake animation
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
        "text-sm sm:text-lg md:text-xl",
        "font-bold uppercase tracking-wide",
        "p-1 rounded-md",
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
