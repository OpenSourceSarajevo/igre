import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import './Header.css';

export function Header() {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <header className="main-header">
      <button 
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? (
          <>
            <Moon size={18} />
            <span>Tamna tema</span>
          </>
        ) : (
          <>
            <Sun size={18} />
            <span>Svijetla tema</span>
          </>
        )}
      </button>
    </header>
  );
}