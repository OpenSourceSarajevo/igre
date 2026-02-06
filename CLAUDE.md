# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Konekcije** - A Connections-style word puzzle game in Bosnian language. Players find groups of four words that share a common category. The game has daily puzzles with four difficulty levels.

The repository is a monorepo with the main project in the `konekcije/` directory.

## Development Commands

All commands should be run from the `konekcije/` directory:

```bash
cd konekcije

# Development
npm run dev          # Start dev server with HMR

# Build
npm run build        # TypeScript compile + Vite build

# Linting
npm run lint         # Run ESLint (currently disabled in CI)

# Preview
npm run preview      # Preview production build locally
```

## Architecture Overview

### Tech Stack
- **React 19** + **TypeScript** + **Vite**
- State management: React hooks (useState, useCallback, useEffect)
- Styling: CSS modules per component
- Analytics: Vercel Analytics

### Key Concepts

**Puzzle Loading System:**
- Puzzles are JSON files in `src/data/puzzles/` named by date (YYYY-MM-DD.json)
- Uses Vite's `import.meta.glob` for dynamic imports
- Falls back to most recent puzzle if today's doesn't exist
- Each puzzle has 4 categories with 4 words each

**Game State Management:**
- Lives in `Game.tsx` component with local state
- Completion data persisted to localStorage per date
- Tracks: selected words, found categories, mistakes (max 4), game status

**Difficulty System:**
- Categories have difficulty levels 1-4
- Each puzzle must have exactly one category of each difficulty
- Colors mapped via `utils/colors.ts`

### Directory Structure

```
konekcije/src/
├── components/          # React components
│   ├── Game.tsx        # Main game logic and state
│   ├── WordGrid.tsx    # 4x4 grid of words
│   ├── CategoryDisplay.tsx  # Shows found categories
│   ├── ResultsModal.tsx     # End game modal
│   ├── DevControls.tsx      # Dev mode date picker
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Archive.tsx     # Historical puzzle browser
├── data/
│   └── puzzles/        # Daily puzzle JSON files
│       ├── YYYY-MM-DD.json
│       └── puzzle.schema.json
├── types/
│   └── game.ts         # TypeScript types
├── utils/
│   ├── puzzleUtils.ts  # Puzzle loading logic
│   ├── gameLogic.ts    # Core game mechanics
│   ├── storageUtils.ts # localStorage persistence
│   ├── dateUtils.ts    # Date formatting
│   ├── devUtils.ts     # Dev mode utilities
│   └── colors.ts       # Difficulty colors
└── hooks/
    └── useDarkMode.ts  # Dark mode toggle
```

## Creating Puzzles

Puzzles are JSON files in `src/data/puzzles/` following this schema:

```json
{
  "$schema": "./puzzle.schema.json",
  "authors": [{ "name": "Author Name" }],
  "date": "YYYY-MM-DD",
  "categories": [
    {
      "name": "Category Name",
      "words": ["Word1", "Word2", "Word3", "Word4"],
      "difficulty": 1
    },
    // ... 3 more categories with difficulty 2, 3, 4
  ]
}
```

**Rules:**
- Exactly 4 categories, exactly 4 words each
- Each category must have unique difficulty (1, 2, 3, 4)
- All words must be unique across the puzzle
- Use title case for Bosnian words (capitalize all nouns)

## Dev Mode

Enable testing of future puzzles without waiting for the date:

```bash
# 1. Create/edit .env file
echo "VITE_DEV_MODE=true" > konekcije/.env

# 2. Restart dev server
npm run dev
```

A purple "🛠️ Dev Mode" panel appears in top-right with date selector dropdown. See `DEV_MODE.md` for full details.

**Disable for production:**
```bash
VITE_DEV_MODE=false
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
- Runs on push/PR to `main`
- Tests Node 20.x and 22.x
- Working directory: `./konekcije`
- Steps: `npm ci` → `npm run build`
- Uploads build artifacts (Node 20.x only)
- Note: Linting is currently commented out

## Language & Translation

This is a **Bosnian language** game. All UI text and puzzle content should be in Bosnian:
- Use appropriate Bosnian translations (e.g., "Fali jedna..." not "One away...")
- Category names should reflect Bosnian culture and context
- Word choices should be familiar to Bosnian speakers

## Storage & State

**localStorage keys:**
- `konekcije-completion-{date}`: Completion data per puzzle date
- `konekcije-dev-date`: Dev mode selected date (if enabled)

**Completion data structure:**
```typescript
{
  date: string;
  completed: boolean;
  status: 'won' | 'lost';
  attempts: number;
  timestamp: string;
  guessHistory: number[][]; // For result display
}
```
