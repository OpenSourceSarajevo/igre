import { Sun, Moon, Calendar, X, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { RulesModal } from '@/games/connections/components/RulesModal';

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
    <header className="flex justify-between items-center px-6 py-3 border-b border-[var(--header-border)] bg-[var(--header-bg)] sticky top-0 z-[100] h-[60px]">
      <div className="flex flex-1">
        {showArchiveButton && (
          <button
            onClick={() => setIsArchiveOpen(!isArchiveOpen)}
            className="bg-transparent border-none text-[var(--text)] p-2 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[rgba(128,128,128,0.15)] cursor-pointer"
            aria-label="Archive"
          >
            <Calendar size={22} />
          </button>
        )}
      </div>

      <div className="flex flex-1 justify-end">
        <button
          onClick={() => setIsRulesOpen(true)}
          className="bg-transparent border-none text-[var(--text)] p-2 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[rgba(128,128,128,0.15)] cursor-pointer mr-2"
          aria-label="How to play"
        >
          <HelpCircle size={22} />
        </button>
        <button
          onClick={toggleTheme}
          className="bg-[var(--tile-bg)] border border-[var(--header-border)] text-[var(--text)] px-4 py-2 rounded-[20px] text-[0.9rem] font-semibold cursor-pointer transition-all duration-200 hover:brightness-90 active:scale-95 flex items-center gap-2"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {isArchiveOpen && showArchiveButton && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-[2px] z-[1000] flex justify-start" onClick={() => setIsArchiveOpen(false)}>
          <div className="w-full max-w-[320px] bg-[var(--header-bg)] h-screen p-6 shadow-[4px_0_15px_rgba(0,0,0,0.2)] overflow-y-auto animate-slide-in border-r border-[var(--header-border)] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-[var(--header-border)] [&::-webkit-scrollbar-thumb]:rounded-[10px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--header-border)]">
              <h2 className="text-xl m-0 text-[var(--text)]">Arhiva</h2>
              <button onClick={() => setIsArchiveOpen(false)} className="bg-transparent border-none text-[var(--text)] p-2 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[rgba(128,128,128,0.15)] cursor-pointer">
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