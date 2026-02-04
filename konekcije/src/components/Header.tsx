import { Sun, Moon, Calendar, X } from 'lucide-react'; 
import { useState } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { Archive } from './Archive';
import './Header.css';

interface HeaderProps {
  onSelectDate: (date: string) => void;
  currentDate: string;
}

export function Header({ onSelectDate, currentDate }: HeaderProps) {
  const { theme, toggleTheme } = useDarkMode();
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const handleDateSelect = (date: string) => {
    onSelectDate(date);
    setIsArchiveOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <button 
          onClick={() => setIsArchiveOpen(!isArchiveOpen)}
          className="icon-btn"
          aria-label="Archive"
        >
          <Calendar size={22} />
        </button>
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

      {isArchiveOpen && (
        <div className="archive-overlay">
          <div className="archive-drawer">
            <div className="drawer-header">
              <h2>Arhiva</h2>
              <button onClick={() => setIsArchiveOpen(false)} className="close-btn">
                <X size={24} />
              </button>
            </div>
            <Archive onSelectDate={handleDateSelect} currentDate={currentDate} />
          </div>
        </div>
      )}
    </header>
  );
}