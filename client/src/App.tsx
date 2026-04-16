import { useState } from "react";
import { Game, Archive, CreatePuzzle, StatsPage, SuggestionsPage } from "@/games/connections";
import { Header } from "./components/Header";
import { getTodayDateString } from "./utils/dateUtils";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "./components/Footer";

function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  if (window.location.pathname === "/stats")
    return (
      <div className="flex flex-col w-full h-dvh">
        <Header />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <StatsPage />
          <Footer />
        </main>
      </div>
    );
  if (window.location.pathname === "/prijedlozi")
    return (
      <div className="flex flex-col w-full h-dvh">
        <Header />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <SuggestionsPage />
          <Footer />
        </main>
      </div>
    );
  if (window.location.pathname === "/kreiraj")
    return (
      <div className="flex flex-col w-full h-dvh">
        <Header />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <CreatePuzzle />
          <Footer />
        </main>
      </div>
    );

  return (
    <div className="flex flex-col w-full h-dvh">
      <Header
        renderArchive={(props) => <Archive {...props} />}
        onSelectDate={setSelectedDate}
        currentDate={selectedDate}
      />

      <main className="flex-1 min-h-0 overflow-y-auto">
        <Game key={selectedDate} forcedDate={selectedDate} />
        <Footer />
      </main>

      <Analytics />
    </div>
  );
}

export default App;
