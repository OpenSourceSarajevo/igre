import './GameControls.css';

interface GameControlsProps {
  onShuffle: () => void;
  onDeselectAll: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  canDeselect: boolean;
  disabled: boolean;
}

export function GameControls({
  onShuffle,
  onDeselectAll,
  onSubmit,
  canSubmit,
  canDeselect,
  disabled,
}: GameControlsProps) {
  return (
    <div className="game-controls">
      <button
        className="control-button secondary"
        onClick={onShuffle}
        disabled={disabled}
      >
        Promiješaj
      </button>
      <button
        className="control-button secondary"
        onClick={onDeselectAll}
        disabled={!canDeselect || disabled}
      >
        Poništi
      </button>
      <button
        className="control-button primary"
        onClick={onSubmit}
        disabled={!canSubmit || disabled}
      >
        Provjeri
      </button>
    </div>
  );
}
