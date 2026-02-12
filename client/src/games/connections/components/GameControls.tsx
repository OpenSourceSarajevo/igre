import GameControlButton from "./GameControlButton";

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
    <div className="flex gap-3 justify-center max-w-[600px] mx-auto my-5 sm:gap-2">
      <GameControlButton onClick={onShuffle} disabled={disabled}>
        Promiješaj
      </GameControlButton>
      <GameControlButton
        onClick={onDeselectAll}
        disabled={!canDeselect || disabled}
      >
        Poništi
      </GameControlButton>
      <GameControlButton
        variant="primary"
        onClick={onSubmit}
        disabled={!canSubmit || disabled}
      >
        Provjeri
      </GameControlButton>
    </div>
  );
}
