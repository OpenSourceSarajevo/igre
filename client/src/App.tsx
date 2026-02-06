import { useState } from 'react';
import { Game } from './components/Game';
import { Header } from './components/Header';
import { getTodayDateString } from './utils/dateUtils';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  return (
    <div className="app-container">
      <Header onSelectDate={setSelectedDate} currentDate={selectedDate} />
    
      <main>
        <Game key={selectedDate} forcedDate={selectedDate} />
      </main>

      <Analytics />
    </div>
  );
}

export default App;