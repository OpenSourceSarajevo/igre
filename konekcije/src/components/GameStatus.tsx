import type { GameStatus as GameStatusType } from '../types/game';
import './GameStatus.css';

interface GameStatusProps {
  mistakes: number;
  maxMistakes: number;
  gameStatus: GameStatusType;
  onNewGame: () => void;
}

export function GameStatus({ mistakes, maxMistakes, gameStatus, onNewGame }: GameStatusProps) {
  return (
    <div className="game-status">
      {gameStatus === 'playing' && (
        <div className="mistakes-counter">
          Greške: {mistakes}/{maxMistakes}
        </div>
      )}

      {gameStatus === 'won' && (
        <div className="game-over won">
          <h2>🎉 Čestitamo!</h2>
          <p>Pronašli ste sve kategorije!</p>
          <button className="new-game-button" onClick={onNewGame}>
            Nova igra
          </button>
        </div>
      )}

      {gameStatus === 'lost' && (
        <div className="game-over lost">
          <h2>😔 Igra završena</h2>
          <p>Potrošili ste sve pokušaje.</p>
          <button className="new-game-button" onClick={onNewGame}>
            Pokušaj ponovo
          </button>
        </div>
      )}
    </div>
  );
}
