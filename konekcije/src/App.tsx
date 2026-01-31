import { Analytics } from '@vercel/analytics/react';
import { Game } from './components/Game';
import './App.css';

function App() {
  return (
    <>
      <Game />
      <Analytics />
    </>
  );
}

export default App;
