interface WordGridProps {
  words: string[];
  selectedWords: string[];
  onWordClick: (word: string) => void;
  disabled: boolean;
}

export function WordGrid({ words, selectedWords, onWordClick, disabled }: WordGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3 w-full max-w-[600px] mx-auto sm:gap-2">
      {words.map((word) => (
        <button
          key={word}
          className={`p-5 text-base font-semibold border-2 border-transparent rounded-lg cursor-pointer transition-all duration-200 min-h-[80px] flex items-center justify-center text-center hover:brightness-90 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:p-[15px] sm:text-sm sm:min-h-[60px] ${
            selectedWords.includes(word)
              ? 'bg-[var(--tile-selected)] text-white border-[var(--tile-selected)]'
              : 'bg-[var(--tile-bg)] text-[var(--text)]'
          }`}
          onClick={() => onWordClick(word)}
          disabled={disabled}
        >
          {word}
        </button>
      ))}
    </div>
  );
}
