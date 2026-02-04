import { useEffect, useState } from 'react';
import { getAllPuzzleDates } from '../utils/puzzleUtils';
import { getCompletion } from '../utils/storageUtils';
import './Archive.css';

interface ArchiveProps {
  onSelectDate: (date: string) => void;
  currentDate: string;
}

export function Archive({ onSelectDate, currentDate }: ArchiveProps) {
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    setDates(getAllPuzzleDates());
  }, []);

  return (
    <div className="archive-container">
      <div className="archive-grid">
        {dates.map((date) => {
          const completion = getCompletion(date);
          const isActive = date === currentDate;
          
          return (
            <button
              key={date}
              className={`archive-item ${isActive ? 'active' : ''} ${completion?.status || ''}`}
              onClick={() => onSelectDate(date)}
            >
              <span className="date-label">{date}</span>
              {completion && (
                <span className="status-dot">
                  {completion.status === 'won' ? '✓' : '✗'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}