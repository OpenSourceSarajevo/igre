# Igre - Multi-Game Platform

A platform for Bosnian language puzzle games.

## Structure

- `/client/` - Frontend application (React + TypeScript + Vite)
- (Future) `/api/` - Backend API services
- (Future) `/shared/` - Shared types and utilities

## Games

### Konekcije
Connections-style word puzzle game in Bosnian. Find groups of four words that share a common category.

- Daily puzzles with four difficulty levels
- Completion tracking via localStorage
- Archive of historical puzzles
- Puzzle submission by community members

## Development

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project with the `connection_puzzles` and `connection_puzzle_submissions` tables (see schema below)

### Environment variables

Create `client/.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Commands

All commands run from `client/`:

```bash
npm run dev       # Start dev server
npm run build     # TypeScript compile + Vite build
npm run preview   # Preview production build
```

## Supabase Schema

Run in the Supabase SQL editor:

```sql
CREATE TABLE connection_puzzles (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  date         text        NOT NULL UNIQUE,
  authors      jsonb       NOT NULL DEFAULT '[]',
  categories   jsonb       NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  published_by uuid        REFERENCES auth.users(id)
);

CREATE TABLE connection_puzzle_submissions (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_at     timestamptz NOT NULL DEFAULT now(),
  submitted_by     uuid        NOT NULL REFERENCES auth.users(id),
  proposed_date    text        NOT NULL,
  authors          jsonb       NOT NULL DEFAULT '[]',
  categories       jsonb       NOT NULL,
  reviewed_at      timestamptz,
  reviewed_by      uuid        REFERENCES auth.users(id),
  rejection_notes  text
);

-- Indexes
CREATE INDEX ON connection_puzzle_submissions (submitted_by);
CREATE INDEX ON connection_puzzle_submissions (reviewed_at) WHERE reviewed_at IS NULL;

-- RLS
ALTER TABLE connection_puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_puzzle_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_puzzles" ON connection_puzzles FOR SELECT USING (true);
CREATE POLICY "admin_write_puzzles" ON connection_puzzles FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "auth_insert_submission" ON connection_puzzle_submissions FOR INSERT
  TO authenticated WITH CHECK (submitted_by = auth.uid());
CREATE POLICY "auth_read_own_submission" ON connection_puzzle_submissions FOR SELECT
  TO authenticated USING (submitted_by = auth.uid());
CREATE POLICY "admin_all_submissions" ON connection_puzzle_submissions FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

## Adding Puzzles

Puzzles are managed through the Supabase dashboard or via the `/kreiraj` page in the app. Each puzzle requires exactly 4 categories, one of each difficulty (1–4), with 4 words each.

**Puzzle structure:**

```json
{
  "date": "YYYY-MM-DD",
  "authors": [{ "name": "Author Name" }],
  "categories": [
    {
      "name": "Category Name",
      "words": ["Word1", "Word2", "Word3", "Word4"],
      "difficulty": 1
    }
  ]
}
```

**Rules:**
- One puzzle per day (`date` is unique)
- Exactly 4 categories with difficulties 1, 2, 3, 4
- All 16 words must be unique
- Use title case for Bosnian words

## Architecture

### Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Supabase** — puzzle storage and (future) auth
- **Tailwind CSS v4** — styling via CSS custom properties
- **Vercel Analytics**

### Key Concepts

**Puzzle Loading:**
- `getPuzzleByDate(date)` queries `connection_puzzles` in Supabase
- Results are cached in a module-level `Map` to avoid redundant fetches
- Archive dates fetched once from `SELECT date FROM connection_puzzles`

**Game State:**
- Lives in `Game.tsx` with local React state
- In-progress state persisted to localStorage after every guess
- Completion data saved to localStorage when game ends

**Directory Structure:**

```
client/src/
├── games/
│   └── connections/
│       ├── components/       # Game UI components
│       ├── utils/
│       │   ├── gameLogic.ts          # Core game mechanics
│       │   ├── puzzleUtils.ts        # Puzzle fetching (Supabase)
│       │   ├── supabasePuzzleUtils.ts # Supabase queries
│       │   ├── storageUtils.ts       # localStorage persistence
│       │   └── colors.ts             # Difficulty colors
│       ├── types/
│       │   └── game.ts
│       └── index.ts
├── components/
│   ├── Header.tsx
│   └── Footer.tsx
├── context/
│   └── AuthContext.tsx       # Supabase auth (wired up, not yet exposed in UI)
├── lib/
│   └── supabase.ts           # Supabase client singleton
├── config/
│   └── gameConfig.ts
├── hooks/
│   └── useDarkMode.ts
└── App.tsx
```

### Styling

Tailwind CSS v4 with CSS custom properties for theming:

- Dark mode via `.dark` class on `<html>`, managed by `useDarkMode` hook
- Use `bg-[var(--header-bg)]` style arbitrary values, not `dark:` variants
- Difficulty colors: yellow (1), green (2), blue (3), purple (4)

### localStorage Keys

- `konekcije_completion_{date}` — written when game ends
- `konekcije_progress_{date}` — written after every guess, cleared on game end
- `theme` — light/dark preference

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`:
- Node 20.x and 22.x
- `npm ci` → `npm run build`
- Build artifacts uploaded (Node 20.x only)
