# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Konekcije** - A Connections-style word puzzle game in Bosnian language. Players find groups of four words that share a common category. The game has daily puzzles with four difficulty levels.

The repository is structured as a multi-game platform with the frontend in the `client/` directory, prepared for future API integration and additional games.

## Development Commands

All commands should be run from the `client/` directory:

```bash
cd client

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
- Styling: **Tailwind CSS v4** with CSS custom properties for theming
- Analytics: Vercel Analytics

### Key Concepts

**Puzzle Loading System:**

- Puzzles are JSON files in `games/connections/data/puzzles/` named by date (YYYY-MM-DD.json)
- Uses Vite's `import.meta.glob` for dynamic imports
- Falls back to most recent puzzle if today's doesn't exist
- Each puzzle has 4 categories with 4 words each

**Game State Management:**

- Lives in `Game.tsx` component with local state
- In-progress state persisted to localStorage after every guess (restored on refresh)
- Completion data saved to localStorage when game ends (won or lost)
- Tracks: selected words, found categories, mistakes (max 4), game status
- All guesses stored as `Guess[]` — each with `words: string[]` and `levels: number[]`

**Difficulty System:**

- Categories have difficulty levels 1-4
- Each puzzle must have exactly one category of each difficulty
- Colors mapped via `utils/colors.ts`

### Directory Structure

```
client/src/
├── games/
│   └── connections/          # Connections game (Konekcije)
│       ├── components/       # Game-specific components
│       │   ├── Game.tsx     # Main game logic and state
│       │   ├── WordGrid.tsx
│       │   ├── CategoryDisplay.tsx
│       │   ├── ResultsModal.tsx
│       │   ├── Archive.tsx
│       │   ├── DevControls.tsx
│       │   └── GameControls.tsx
│       ├── utils/
│       │   ├── gameLogic.ts     # Core game mechanics
│       │   ├── puzzleUtils.ts   # Puzzle loading
│       │   ├── storageUtils.ts  # localStorage persistence
│       │   ├── devUtils.ts      # Dev mode utilities
│       │   └── colors.ts        # Difficulty colors
│       ├── types/
│       │   └── game.ts          # Connections-specific types
│       ├── data/
│       │   └── puzzles/         # Daily puzzle JSON files
│       │       ├── YYYY-MM-DD.json
│       │       └── puzzle.schema.json
│       └── index.ts             # Public API exports
├── components/              # SHARED components
│   ├── Header.tsx          # App header with theme toggle
│   └── Footer.tsx          # App footer
├── config/
│   └── gameConfig.ts       # Game configuration
├── types/
│   └── shared.ts           # Shared type definitions
├── utils/
│   └── dateUtils.ts        # Date formatting utilities
├── hooks/
│   └── useDarkMode.ts      # Dark mode hook
├── App.tsx                 # Main app component
├── main.tsx               # App entry point
└── index.css              # Global styles
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
    }
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
echo "VITE_DEV_MODE=true" > client/.env

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
- Working directory: `./client`
- Steps: `npm ci` → `npm run build`
- Uploads build artifacts (Node 20.x only)
- Note: Linting is currently commented out

## Language & Translation

This is a **Bosnian language** game. All UI text and puzzle content should be in Bosnian:

- Use appropriate Bosnian translations (e.g., "Fali jedna..." not "One away...")
- Category names should reflect Bosnian culture and context
- Word choices should be familiar to Bosnian speakers

## Configuration

**Game Configuration** (`src/config/gameConfig.ts`):

- Centralized configuration for game name, branding, and settings

## Styling

**Tailwind CSS v4** is used for all styling via `@tailwindcss/vite` plugin:

**Dark Mode Implementation:**

- Class-based strategy: `.dark` class on `<html>` element
- Managed by `useDarkMode` hook (adds/removes `.dark` class on `documentElement`)
- Persisted to localStorage under `theme` key

**Color System:**
All components use CSS custom properties that automatically switch with theme:

```css
/* Defined in index.css */
:root {
  --text: #1a1a1b;
  --bg: #f5f5f5;
  --header-bg: #ffffff;
  --header-border: #d3d6da;
  --tile-bg: #efefe6;
  --tile-selected: #5a594e;
}

.dark {
  --text: #d7dadc;
  --bg: #121213;
  --header-bg: #121213;
  --header-border: #3a3a3c;
  --tile-bg: #3a3a3c;
  --tile-selected: #818384;
}
```

**Usage in Components:**

- Use CSS variables with Tailwind arbitrary values: `bg-[var(--header-bg)]`, `text-[var(--text)]`
- Never use `dark:` variants with arbitrary colors (Tailwind v4 limitation)
- CSS variables automatically update when theme changes

**Difficulty Colors:**
Defined in `@theme` directive in `index.css`:

- Level 1 (Easy): `--color-difficulty-1: #f9df6d` (yellow)
- Level 2 (Medium): `--color-difficulty-2: #a0c35a` (green)
- Level 3 (Hard): `--color-difficulty-3: #b0c4ef` (blue)
- Level 4 (Very Hard): `--color-difficulty-4: #ba81c5` (purple)

**Custom Animations:**

- `animate-slide-in`: Archive drawer slide animation
- `animate-toast-in`: Feedback message pop-in
- `animate-reveal`: Category reveal on solve

**Best Practices:**

- Use semantic color variables (e.g., `--text`, `--bg`) instead of hardcoded colors
- All spacing, sizing, and responsive design should use Tailwind utilities
- Avoid creating new CSS files - use Tailwind utilities exclusively

## Storage & State

**localStorage keys:**

- `konekcije_completion_{date}`: Completion data, written when game ends (won/lost)
- `konekcije_progress_{date}`: In-progress state, written after every guess, cleared on game end
- `konekcije_dev_date`: Dev mode selected date (if enabled)
- `theme`: Light/dark theme preference
- Note: Keys maintain `konekcije_` prefix for backward compatibility

**Completion data structure (`CompletionData`):**

```typescript
{
  date: string;
  completed: boolean;
  status: 'won' | 'lost';
  attempts: number;
  timestamp: string;
  guessHistory: number[][]; // Difficulty levels per guess, for result display
}
```

**In-progress data structure (`InProgressData`):**

```typescript
{
  mistakes: number;
  foundCategoryNames: string[];
  guessHistory: { words: string[]; levels: number[] }[];
  remainingWords: string[]; // Preserves current word order
}
```
