import type { GameStatus as GameStatusType } from '../types/game';

interface GameStatusProps {
  mistakes: number;
  maxMistakes: number;
  gameStatus: GameStatusType;
  onNewGame: () => void;
}

export function GameStatus({ mistakes, maxMistakes, gameStatus, onNewGame }: GameStatusProps) {
  return (
    <div className="max-w-[600px] mx-auto my-5 text-center">
      {gameStatus === 'playing' && (
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Greške: {mistakes}/{maxMistakes}
        </div>
      )}

      {gameStatus === 'won' && (
        <div className="p-8 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600">
          <h2 className="text-[32px] m-0 mb-3 text-gray-800 dark:text-gray-200">🎉 Čestitamo!</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 m-0 mb-6">Pronašli ste sve kategorije!</p>
          <button
            className="py-3 px-8 text-base font-semibold bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 border-none rounded-3xl cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            onClick={onNewGame}
          >
            Nova igra
          </button>
        </div>
      )}

      {gameStatus === 'lost' && (
        <div className="p-8 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600">
          <h2 className="text-[32px] m-0 mb-3 text-gray-800 dark:text-gray-200">😔 Igra završena</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 m-0 mb-6">Potrošili ste sve pokušaje.</p>
          <button
            className="py-3 px-8 text-base font-semibold bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 border-none rounded-3xl cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            onClick={onNewGame}
          >
            Pokušaj ponovo
          </button>
        </div>
      )}
    </div>
  );
}
