import './WordGrid.css';

interface WordGridProps {
  words: string[];
  selectedWords: string[];
  onWordClick: (word: string) => void;
  disabled: boolean;
}

export function WordGrid({ words, selectedWords, onWordClick, disabled }: WordGridProps) {
  return (
    <div className="word-grid">
      {words.map((word) => (
        <button
          key={word}
          className={`word-button ${selectedWords.includes(word) ? 'selected' : ''}`}
          onClick={() => onWordClick(word)}
          disabled={disabled}
        >
          {word}
        </button>
      ))}
    </div>
  );
}
