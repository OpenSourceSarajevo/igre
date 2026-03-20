import type { DailyPuzzle } from "../types/game";

const allPuzzleModules = import.meta.glob<{ default: DailyPuzzle }>(
  "../data/puzzles/*.json",
  { eager: true },
);

const MONTH_NAMES = [
  "Januar", "Februar", "Mart", "April", "Maj", "Juni",
  "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar",
];

function formatMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("-");
  return `${MONTH_NAMES[parseInt(month) - 1]} ${year}`;
}

export function StatsPage() {
  const authorCounts: Record<string, number> = {};
  const monthData: Record<string, { total: number; authors: Record<string, number> }> = {};

  for (const module of Object.values(allPuzzleModules)) {
    const puzzle = module.default;
    if (!puzzle.date) continue;
    const yearMonth = puzzle.date.slice(0, 7);

    if (!monthData[yearMonth]) {
      monthData[yearMonth] = { total: 0, authors: {} };
    }
    monthData[yearMonth].total += 1;

    for (const author of puzzle.authors ?? []) {
      if (!author.name) continue;
      authorCounts[author.name] = (authorCounts[author.name] ?? 0) + 1;
      monthData[yearMonth].authors[author.name] =
        (monthData[yearMonth].authors[author.name] ?? 0) + 1;
    }
  }

  const authorRows = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]);
  const total = authorRows.reduce((sum, [, n]) => sum + n, 0);

  const monthRows = Object.entries(monthData).sort((a, b) =>
    b[0].localeCompare(a[0]),
  );

  return (
    <div className="bg-app-bg text-app-text">
      <div className="max-w-2xl mx-auto p-6 flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-sm opacity-50 hover:opacity-100 transition-opacity"
          >
            ← Natrag
          </a>
          <h1 className="text-2xl font-bold">Statistike autora</h1>
          <span className="ml-auto text-sm opacity-40">{total} ukupno</span>
        </div>

        {/* Author leaderboard */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-header-border text-sm opacity-60">
              <th className="text-left py-2 px-3 font-semibold">Autor</th>
              <th className="text-right py-2 px-3 font-semibold w-16">Zag.</th>
              <th className="text-right py-2 px-3 font-semibold w-14">%</th>
            </tr>
          </thead>
          <tbody>
            {authorRows.map(([name, count]) => (
              <tr
                key={name}
                className="border-b border-header-border hover:bg-tile-bg transition-colors"
              >
                <td className="py-3 px-3 font-medium">{name}</td>
                <td className="text-right py-3 px-3 font-mono font-bold text-lg">
                  {count}
                </td>
                <td className="text-right py-3 px-3 text-sm opacity-50">
                  {Math.round((count / total) * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Monthly breakdown */}
        <div>
          <h2 className="text-lg font-bold mb-4">Po mjesecu</h2>
          <div className="flex flex-col gap-3">
            {monthRows.map(([yearMonth, data]) => (
              <div
                key={yearMonth}
                className="border border-header-border rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">{formatMonth(yearMonth)}</span>
                  <span className="text-sm opacity-50 font-mono">
                    {data.total} {data.total === 1 ? "konekcija" : "konekcije"}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(data.authors)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, count]) => (
                      <div key={name} className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full bg-tile-selected opacity-60"
                          style={{
                            width: `${Math.round((count / data.total) * 100)}%`,
                            minWidth: "4px",
                          }}
                        />
                        <span className="text-sm opacity-70 shrink-0">
                          {name}
                        </span>
                        <span className="text-sm font-mono ml-auto opacity-50">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
