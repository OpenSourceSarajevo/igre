import { Analytics } from '@vercel/analytics/react';
import { Game } from './components/Game';
import { Header } from './components/Header';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Game />
      </main>
      <Analytics />
    </div>
  );
}

export default App;