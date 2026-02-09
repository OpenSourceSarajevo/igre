import { useEffect, useState, useMemo } from "react";
import { getAllPuzzleDates } from "../utils/puzzleUtils";
import { getCompletion } from "../utils/storageUtils";

interface ArchiveProps {
  onSelectDate: (date: string) => void;
  currentDate: string;
}

export function Archive({ onSelectDate, currentDate }: ArchiveProps) {
  const [dates, setDates] = useState<string[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  // 1. Define Bosnian Months Manually
  const bosnianMonths = [
    "Januar",
    "Februar",
    "Mart",
    "April",
    "Maj",
    "Jun",
    "Jul",
    "August",
    "Septembar",
    "Oktobar",
    "Novembar",
    "Decembar",
  ];

  useEffect(() => {
    const allDates = getAllPuzzleDates();
    setDates(allDates);

    const currentMonthKey = currentDate.substring(0, 7);
    setExpandedMonths([currentMonthKey]);
  }, [currentDate]);

  const groupedPuzzles = useMemo(() => {
    const groups: Record<string, string[]> = {};
    dates.forEach((date) => {
      const monthKey = date.substring(0, 7);
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(date);
    });
    return groups;
  }, [dates]);

  // 2. Updated Formatting Function
  const formatMonthHeader = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const monthIndex = parseInt(month, 10) - 1; // 01 becomes 0
    const monthName = bosnianMonths[monthIndex];
    return `${monthName} ${year}`;
  };

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths((prev) =>
      prev.includes(monthKey)
        ? prev.filter((m) => m !== monthKey)
        : [...prev, monthKey],
    );
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {Object.keys(groupedPuzzles).map((monthKey) => (
        <div
          key={monthKey}
          className="border border-[var(--header-border)] rounded-lg overflow-hidden bg-[var(--tile-bg)]"
        >
          <button
            className="w-full py-3 px-4 bg-[var(--tile-bg)] border-none text-[var(--text)] font-bold flex justify-between items-center cursor-pointer"
            onClick={() => toggleMonth(monthKey)}
          >
            <span>{formatMonthHeader(monthKey)}</span>
            <span
              className={`text-[0.8rem] transition-transform duration-200 ${expandedMonths.includes(monthKey) ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>

          {expandedMonths.includes(monthKey) && (
            <div className="grid grid-cols-4 gap-2 p-3 bg-[var(--header-bg)] border-t border-[var(--header-border)]">
              {groupedPuzzles[monthKey].map((date) => {
                const completion = getCompletion(date);
                const isActive = date === currentDate;
                const day = date.split("-")[2];
                const month = date.split("-")[1];

                return (
                  <button
                    key={date}
                    className={`aspect-square flex flex-col items-center justify-center rounded bg-[var(--tile-bg)] text-[var(--text)] cursor-pointer relative overflow-hidden border-none transition-transform duration-100 ${
                      isActive
                        ? "font-extrabold shadow-[inset_0_0_0_3px] shadow-[var(--tile-selected)]"
                        : ""
                    } ${
                      completion?.status === "won"
                        ? "bg-[#a0c35a] text-white"
                        : ""
                    } ${
                      completion?.status === "lost"
                        ? "bg-[#787c7e] text-white"
                        : ""
                    }`}
                    onClick={() => onSelectDate(date)}
                  >
                    <span className="font-semibold text-[0.85rem]">
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
