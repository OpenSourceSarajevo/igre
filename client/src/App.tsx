import { useState } from "react";
import { Game, Archive } from "@/games/connections";
import { Header } from "./components/Header";
import { getTodayDateString } from "./utils/dateUtils";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  return (
    <div className="w-full min-h-screen">
      <Header
        renderArchive={(props) => <Archive {...props} />}
        onSelectDate={setSelectedDate}
        currentDate={selectedDate}
      />

      <main>
        <Game key={selectedDate} forcedDate={selectedDate} />
      </main>

      <Analytics />
    </div>
  );
}

export default App;
