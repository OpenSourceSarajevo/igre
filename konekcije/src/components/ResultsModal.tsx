import { X } from 'lucide-react';
import type { GameStatus } from '../types/game'; // Import your type
import './ResultsModal.css';

interface ResultsModalProps {
  history: number[][];
  date: string;
  status: GameStatus; // Changed from '"won" | "lost"' to 'GameStatus'
  onClose: () => void;
  onNewGame: () => void;
}

export function ResultsModal({ history, date, status, onClose, onNewGame }: ResultsModalProps) {
  const getEmoji = (level: number) => {
    switch (level) {
      case 1: return '🟨';
      case 2: return '🟩';
      case 3: return '🟦';
      case 4: return '🟪';
      default: return '⬛';
    }
  };

  const copyToClipboard = () => {
    const grid = history
      .map(row => row.map(level => getEmoji(level)).join(''))
      .join('\n');
    const text = `Konekcije\nSlagalica: ${date.split('-').reverse().join('/')}\n${grid}`;
    navigator.clipboard.writeText(text);
    alert('Rezultat kopiran u međuspremnik!');
  };

  if (!history || history.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="results-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        
        <div className="modal-content">
          <h2 className="status-title">
            {status === 'won' ? '🎉 Čestitamo!' : '😔 Igra završena'}
          </h2>
          <p className="status-message">
            {status === 'won' ? 'Pronašli ste sve kategorije!' : 'Više sreće drugi put.'}
          </p>

          <div className="emoji-grid">
            {history.map((row, i) => (
              <div key={i} className="emoji-row">
                {row.map((level, j) => (
                  <span key={j}>{getEmoji(level)}</span>
                ))}
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button className="share-button" onClick={copyToClipboard}>
              Podijeli rezultat
            </button>
            <button className="new-game-button-modal" onClick={onNewGame}>
              Nova igra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}