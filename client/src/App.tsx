import { useState } from "react";
import { Game, Archive } from "@/games/connections";
import { Header } from "./components/Header";
import { getTodayDateString } from "./utils/dateUtils";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "./components/Footer";

function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

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
