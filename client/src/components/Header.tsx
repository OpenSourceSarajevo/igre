import { Sun, Moon, Calendar, X } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
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
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {isArchiveOpen && showArchiveButton && (
        <div className="archive-overlay">
          <div className="archive-drawer">
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
    </header>
  );
}