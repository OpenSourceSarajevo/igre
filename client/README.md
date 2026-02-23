# Konekcije – Frontend

React + TypeScript + Vite frontend for the **Konekcije** word puzzle game.

## Requirements

- Node.js 20.x or 22.x (ESLint 9 requires Node 18.18+)
- npm

## Setup

```bash
npm install
```

## Development Commands

```bash
npm run dev      # Start dev server with HMR at http://localhost:5173
npm run build    # TypeScript compile + Vite build → dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── games/
│   └── connections/          # Konekcije game
│       ├── components/       # Game UI components
│       │   ├── Game.tsx      # Main game logic and state
│       │   ├── WordGrid.tsx
│       │   ├── CategoryDisplay.tsx
│       │   ├── GameControls.tsx
│       │   ├── ResultsModal.tsx
│       │   ├── Archive.tsx
│       │   ├── Toast.tsx
│       │   └── DevControls.tsx
│       ├── utils/
│       │   ├── gameLogic.ts      # Core game mechanics (checkGuess, isGameWon, etc.)
│       │   ├── puzzleUtils.ts    # Puzzle loading via import.meta.glob
│       │   ├── storageUtils.ts   # localStorage persistence
│       │   ├── devUtils.ts       # Dev mode utilities
│       │   └── colors.ts         # Difficulty level colors
│       ├── types/
│       │   └── game.ts           # Connections-specific types
│       ├── data/
│       │   └── puzzles/          # Daily puzzle JSON files (YYYY-MM-DD.json)
│       └── index.ts              # Public API exports
├── components/
│   ├── Header.tsx            # App header with theme toggle
│   └── Footer.tsx            # App footer
├── config/
│   └── gameConfig.ts         # Game name, branding, settings
├── hooks/
│   └── useDarkMode.ts        # Dark mode + favicon switching
├── utils/
│   └── dateUtils.ts          # Date formatting
├── types/
│   └── shared.ts             # Shared type definitions
├── App.tsx                   # Root layout (h-dvh flex column)
├── main.tsx                  # Entry point
└── index.css                 # Tailwind v4 + CSS custom properties
```

## Creating a Puzzle

Add a JSON file to `src/games/connections/data/puzzles/` named `YYYY-MM-DD.json`:

```json
{
  "$schema": "./puzzle.schema.json",
  "authors": [{ "name": "Author Name" }],
  "date": "YYYY-MM-DD",
  "categories": [
    { "name": "Category Name", "words": ["Word1", "Word2", "Word3", "Word4"], "difficulty": 1 },
    { "name": "Category Name", "words": ["Word1", "Word2", "Word3", "Word4"], "difficulty": 2 },
    { "name": "Category Name", "words": ["Word1", "Word2", "Word3", "Word4"], "difficulty": 3 },
    { "name": "Category Name", "words": ["Word1", "Word2", "Word3", "Word4"], "difficulty": 4 }
  ]
}
```

Rules: exactly 4 categories, exactly 4 words each, one of each difficulty (1–4), all words unique.

## Dev Mode

Test future puzzles without waiting for their date:

```bash
# Enable
echo "VITE_DEV_MODE=true" > .env
npm run dev
```

A purple "Dev Mode" panel appears with a date selector. Disable before deploying:

```bash
echo "VITE_DEV_MODE=false" > .env
```

## Styling

Uses **Tailwind CSS v4** via `@tailwindcss/vite`. Theme is driven by CSS custom properties:

- Always use `bg-[var(--bg)]`, `text-[var(--text)]`, etc. — never hardcode colors
- Never use `dark:` variant with arbitrary values (Tailwind v4 limitation)
- Dark mode is toggled by adding/removing `.dark` class on `<html>`

Difficulty colors: yellow (1), green (2), blue (3), purple (4).

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `konekcije_completion_{date}` | Final result saved on win/loss |
| `konekcije_progress_{date}` | In-progress state saved after every guess |
| `konekcije_dev_date` | Dev mode selected date |
| `theme` | Light/dark preference |
