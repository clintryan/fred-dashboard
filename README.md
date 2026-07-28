# fred-dashboard

Fred's internal dashboard. The UI is a Vite/React app, and the habit tracker
MVP adds a tiny local Node sidecar for SQLite persistence and Telegram reminder
scheduling.

## Local architecture

- `src/`: dashboard UI
- `server/index.mjs`: local habit API, SQLite setup, and 7:00 AM reminder scheduler
- `data/habits.sqlite`: generated local database

This keeps the existing dashboard repo as the primary home for the feature,
while acknowledging that SQLite and a scheduled Telegram job cannot run inside
a static browser-only app.

## Habit tracker MVP

Tracks one daily entry with:

- three-line journal
- meal-prep adherence
- alcohol-free day
- spending under 100 baht

The API also exposes a Marcus Aurelius-style reminder preview and schedules a
real 7:00 AM Telegram send when `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are
configured.

## Setup

Create `.env.local`:

```bash
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
HABIT_REMINDER_HOUR=7
HABIT_API_PORT=8787
```

If the Telegram vars are omitted, the reminder scheduler stays in preview-only
mode and logs that sends are disabled.

## Run locally

```bash
npm install
npm run server
npm run dev
```

Open `http://127.0.0.1:5173/fred-dashboard/dashboard.html` for the React/Vite
dashboard MVP with the habit tracker.

## Build

```bash
npm run build
```

The static build still succeeds without the API; the habit card will simply say
that the local habit service is offline until `npm run server` is running.

## Why `dashboard.html`

This repo still has a legacy hand-edited `index.html` with local uncommitted
changes. The MVP intentionally uses `dashboard.html` as the Vite entry so the
new work can ship without clobbering that file.
