import { useDarkMode } from '../hooks/useDarkMode';
import './Header.css';

export function Header() {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <header className="main-header">
      <button 
        onClick={toggleTheme}
        className="theme-toggle-btn"
      >
        {theme === 'light' ? '🌙 Tamna tema' : '☀️ Svijetla tema'}
      </button>
    </header>
  );
}