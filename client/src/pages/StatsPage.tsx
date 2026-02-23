import type { DailyPuzzle } from "../games/connections/types/game";

const allPuzzleModules = import.meta.glob<{ default: DailyPuzzle }>(
  "../games/connections/data/puzzles/*.json",
  { eager: true },
);

export function StatsPage() {
  const authorCounts: Record<string, number> = {};

  for (const module of Object.values(allPuzzleModules)) {
    const puzzle = module.default;
    for (const author of puzzle.authors ?? []) {
      if (!author.name) continue;
      authorCounts[author.name] = (authorCounts[author.name] ?? 0) + 1;
    }
  }

  const rows = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]);
  const total = rows.reduce((sum, [, n]) => sum + n, 0);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <a
            href="/"
            className="text-sm opacity-50 hover:opacity-100 transition-opacity"
          >
            ← Natrag
          </a>
          <h1 className="text-2xl font-bold">Statistike autora</h1>
          <span className="ml-auto text-sm opacity-40">{total} ukupno</span>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--header-border)] text-sm opacity-60">
              <th className="text-left py-2 px-3 font-semibold">Autor</th>
              <th className="text-right py-2 px-3 font-semibold w-16">Zag.</th>
              <th className="text-right py-2 px-3 font-semibold w-14">%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, count]) => (
              <tr
                key={name}
                className="border-b border-[var(--header-border)] hover:bg-[var(--tile-bg)] transition-colors"
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
      </div>
    </div>
  );
}
