import { useState, useEffect } from 'react';
import { isDevMode, getDevDate, setDevDate, clearDevDate } from '../utils/devUtils';
import { getAllPuzzleDates } from '../utils/puzzleUtils';
import { getTodayDateString } from '../utils/dateUtils';
import './DevControls.css';

interface DevControlsProps {
  onDateChange: () => void;
}

export function DevControls({ onDateChange }: DevControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getDevDate() || getTodayDateString());
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    const dates = getAllPuzzleDates();
    setAvailableDates(dates);
  }, []);

  // Don't render anything if dev mode is not enabled
  if (!isDevMode()) {
    return null;
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setDevDate(date);
    onDateChange();
  };

  const handleUseToday = () => {
    clearDevDate();
    const today = getTodayDateString();
    setSelectedDate(today);
    onDateChange();
  };

  if (!isExpanded) {
    return (
      <div className="dev-controls collapsed">
        <button onClick={() => setIsExpanded(true)} className="dev-toggle-button">
          🛠️ Dev Mode
        </button>
      </div>
    );
  }

  return (
    <div className="dev-controls expanded">
      <div className="dev-header">
        <h3>🛠️ Dev Mode</h3>
        <button onClick={() => setIsExpanded(false)} className="dev-close-button">
          −
        </button>
      </div>

      <div className="dev-content">
        <div className="dev-field">
          <label htmlFor="dev-date-picker">Select Puzzle Date:</label>
          <select
            id="dev-date-picker"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="dev-date-select"
          >
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div className="dev-actions">
          <button onClick={handleUseToday} className="dev-button">
            Use Today's Date
          </button>
        </div>

        <div className="dev-info">
          <small>
            Active: {getDevDate() || `Today (${getTodayDateString()})`}
          </small>
        </div>
      </div>
    </div>
  );
}
