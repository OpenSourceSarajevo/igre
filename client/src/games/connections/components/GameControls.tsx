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
      <button
        className="px-6 py-3 text-base font-semibold border-none rounded-[24px] cursor-pointer transition-all duration-200 bg-[var(--tile-bg)] text-[var(--text)] hover:brightness-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none sm:px-5 sm:py-[10px] sm:text-sm"
        onClick={onShuffle}
        disabled={disabled}
      >
        Promiješaj
      </button>
      <button
        className="px-6 py-3 text-base font-semibold border-none rounded-[24px] cursor-pointer transition-all duration-200 bg-[var(--tile-bg)] text-[var(--text)] hover:brightness-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none sm:px-5 sm:py-[10px] sm:text-sm"
        onClick={onDeselectAll}
        disabled={!canDeselect || disabled}
      >
        Poništi
      </button>
      <button
        className="px-6 py-3 text-base font-semibold border-none rounded-[24px] cursor-pointer transition-all duration-200 bg-[var(--text)] text-[var(--bg)] hover:brightness-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none sm:px-5 sm:py-[10px] sm:text-sm"
        onClick={onSubmit}
        disabled={!canSubmit || disabled}
      >
        Provjeri
      </button>
    </div>
  );
}
