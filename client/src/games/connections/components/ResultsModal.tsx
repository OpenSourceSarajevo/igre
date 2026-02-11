import { X } from "lucide-react";
import type { GameStatus } from "../types/game";
import { currentGame } from "@/config/gameConfig";

interface ResultsModalProps {
  history: number[][];
  date: string;
  status: GameStatus; // Changed from '"won" | "lost"' to 'GameStatus'
  onClose: () => void;
  onNewGame: () => void;
}

export function ResultsModal({
  history,
  date,
  status,
  onClose,
  onNewGame,
}: ResultsModalProps) {
  const getEmoji = (level: number) => {
    switch (level) {
      case 1:
        return "🟨";
      case 2:
        return "🟩";
      case 3:
        return "🟦";
      case 4:
        return "🟪";
      default:
        return "⬛";
    }
  };

  const copyToClipboard = () => {
    const grid = history
      .map((row) => row.map((level) => getEmoji(level)).join(""))
      .join("\n");
    const text = `${currentGame.name}\nSlagalica: ${date.split("-").reverse().join("/")}\n${grid}`;
    navigator.clipboard.writeText(text);
    alert("Rezultat kopiran u međuspremnik!");
  };

  if (!history || history.length === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 flex items-center justify-center z-[2000] p-5"
      onClick={onClose}
    >
      <div
        className="bg-header-bg w-full max-w-[400px] rounded-2xl relative py-10 px-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-[15px] right-[15px] bg-transparent border-none cursor-pointer text-app-text"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div>
          <h2 className="text-[1.8rem] mb-2 text-app-text">
            {status === "won" ? "🎉 Čestitamo!" : "😔 Igra završena"}
          </h2>
          <p className="mb-6 opacity-80 text-app-text">
            {status === "won"
              ? "Pronašli ste sve kategorije!"
              : "Više sreće drugi put."}
          </p>

          <div className="flex flex-col gap-1 mb-[30px]">
            {history.map((row, i) => (
              <div
                key={i}
                className="text-[1.8rem] leading-none tracking-[6px]"
              >
                {row.map((level, j) => (
                  <span key={j}>{getEmoji(level)}</span>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              className="bg-app-text text-app-bg border-none py-[14px] px-4 rounded-[30px] font-bold text-base cursor-pointer"
              onClick={copyToClipboard}
            >
              Podijeli rezultat
            </button>
            <button
              className="bg-transparent text-app-text border border-header-border py-[14px] px-4 rounded-[30px] font-bold text-base cursor-pointer"
              onClick={onNewGame}
            >
              Nova igra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
