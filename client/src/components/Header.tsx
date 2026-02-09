import { Sun, Moon, Calendar, X, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { RulesModal } from '@/games/connections/components/RulesModal';
import './Header.css';

interface HeaderProps {
  renderArchive?: (props: {
    onSelectDate: (date: string) => void;
    currentDate: string;
  }) => ReactNode;
  onSelectDate?: (date: string) => void;
  currentDate?: string;
}

export function Header({ renderArchive, onSelectDate, currentDate }: HeaderProps) {
  const { theme, toggleTheme } = useDarkMode();
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handleDateSelect = (date: string) => {
    onSelectDate?.(date);
    setIsArchiveOpen(false);
  };

  const showArchiveButton = renderArchive && onSelectDate && currentDate;

  return (
    <header className="main-header">
      <div className="header-left">
        {showArchiveButton && (
          <button
            onClick={() => setIsArchiveOpen(!isArchiveOpen)}
            className="icon-btn"
            aria-label="Archive"
          >
            <Calendar size={22} />
          </button>
        )}
      </div>

      <div className="header-right">
        <button
          onClick={() => setIsRulesOpen(true)}
          className="icon-btn"
          aria-label="How to play"
          style={{ marginRight: '8px' }}
        >
          <HelpCircle size={22} />
        </button>
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {isArchiveOpen && showArchiveButton && (
        <div className="archive-overlay" onClick={() => setIsArchiveOpen(false)}>
          <div className="archive-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Arhiva</h2>
              <button onClick={() => setIsArchiveOpen(false)} className="close-btn">
                <X size={24} />
              </button>
            </div>
            {renderArchive({ onSelectDate: handleDateSelect, currentDate })}
          </div>
        </div>
      )}

      {isRulesOpen && <RulesModal onClose={() => setIsRulesOpen(false)} />}
    </header>
  );
}