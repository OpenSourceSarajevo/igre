import { useEffect, useState, useMemo } from 'react';
import { getAllPuzzleDates } from '../utils/puzzleUtils';
import { getCompletion } from '../utils/storageUtils';
import './Archive.css';

interface ArchiveProps {
  onSelectDate: (date: string) => void;
  currentDate: string;
}

export function Archive({ onSelectDate, currentDate }: ArchiveProps) {
  const [dates, setDates] = useState<string[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  // 1. Define Bosnian Months Manually
  const bosnianMonths = [
    "Januar", "Februar", "Mart", "April", "Maj", "Jun", 
    "Jul", "August", "Septembar", "Oktobar", "Novembar", "Decembar"
  ];

  useEffect(() => {
    const allDates = getAllPuzzleDates();
    setDates(allDates);
    
    const currentMonthKey = currentDate.substring(0, 7);
    setExpandedMonths([currentMonthKey]);
  }, [currentDate]);

  const groupedPuzzles = useMemo(() => {
    const groups: Record<string, string[]> = {};
    dates.forEach(date => {
      const monthKey = date.substring(0, 7);
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(date);
    });
    return groups;
  }, [dates]);

  // 2. Updated Formatting Function
  const formatMonthHeader = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const monthIndex = parseInt(month, 10) - 1; // 01 becomes 0
    const monthName = bosnianMonths[monthIndex];
    return `${monthName} ${year}`;
  };

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => 
      prev.includes(monthKey) 
        ? prev.filter(m => m !== monthKey) 
        : [...prev, monthKey]
    );
  };

  return (
    <div className="archive-container">
      {Object.keys(groupedPuzzles).map(monthKey => (
        <div key={monthKey} className="archive-month-group">
          <button 
            className="month-header"
            onClick={() => toggleMonth(monthKey)}
          >
            <span>{formatMonthHeader(monthKey)}</span>
            <span className={`arrow ${expandedMonths.includes(monthKey) ? 'up' : 'down'}`}>▼</span>
          </button>
          
          {expandedMonths.includes(monthKey) && (
            <div className="archive-grid">
              {groupedPuzzles[monthKey].map(date => {
                const completion = getCompletion(date);
                const isActive = date === currentDate;
                const day = date.split('-')[2];
                const month = date.split('-')[1];
                
                return (
                  <button
                    key={date}
                    className={`archive-item ${isActive ? 'active' : ''} ${completion?.status || ''}`}
                    onClick={() => onSelectDate(date)}
                  >
                    <span className="date-label">
                      {day}.{month}.
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}