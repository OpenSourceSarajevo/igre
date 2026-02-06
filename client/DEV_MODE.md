# Dev Mode - Testing Daily Puzzles

Dev Mode allows you to test different puzzle dates without waiting for the actual date to arrive.

## Setup

### 1. Enable Dev Mode

Create or edit the `.env` file in the project root:

```bash
# .env
VITE_DEV_MODE=true
```

**Important:** The `.env` file is git-ignored to prevent accidentally committing development settings.

### 2. Restart Dev Server

After changing `.env`, restart the Vite dev server:

```bash
npm run dev
```

The dev controls will now appear in the top-right corner.

## Using Dev Mode

Once enabled, you'll see a purple "🛠️ Dev Mode" panel in the top-right corner.

### Switching Between Puzzles

1. Click the panel to expand it (if collapsed)
2. Select a date from the dropdown (e.g., "2026-01-30" or "2026-01-31")
3. The puzzle will automatically reload for that date
4. Your completion status is tracked per date

### Collapsing the Panel

Click the "−" button to minimize the panel. Click "🛠️ Dev Mode" to expand it again.

### Resetting to Today

Click "Use Today's Date" to clear the date override and return to using the actual current date.

## How It Works

- **Environment Variable**: Dev mode is enabled via `VITE_DEV_MODE=true` in `.env`
- **Date Override**: When a date is selected, it overrides `getTodayDateString()`
- **localStorage**: Selected date is stored in localStorage for persistence
- **Completion Tracking**: Each date has separate completion tracking
- **Hot Reload**: Changes to the date trigger a full puzzle reload

## Production

For production builds, ensure `.env` has:

```bash
VITE_DEV_MODE=false
```

Or simply remove the `VITE_DEV_MODE` variable entirely. The dev controls will not appear in production.

## Adding Test Puzzles

Create new puzzle files in `src/data/puzzles/` with the date as the filename:

```bash
# Example: Create a puzzle for February 1st
touch src/data/puzzles/2026-02-01.json
```

The new date will automatically appear in the Dev Mode date picker after the dev server hot-reloads.

## Environment Variables

See `.env.example` for all available environment variables:

```bash
# Copy example to create your local .env
cp .env.example .env

# Edit as needed
nano .env
```

## Tips

- Use Dev Mode to test puzzles before they go live
- Test completion flow for different dates
- Verify localStorage tracking works correctly
- Check puzzle fallback behavior (when no puzzle exists for a date)
- The dev panel stays accessible but out of the way when collapsed

## File Structure

```
client/
├── .env                    # Your local dev settings (git-ignored)
├── .env.example            # Example environment variables
├── src/
│   ├── data/
│   │   └── puzzles/
│   │       ├── 2026-01-30.json
│   │       ├── 2026-01-31.json
│   │       └── ...
│   ├── utils/
│   │   └── devUtils.ts     # Dev mode utilities
│   └── components/
│       └── DevControls.tsx # Dev control panel
```
