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

## Supervised cloud development

Open this repository in a cloud coding session and read current `main`. The
**Cloud build and isolated API smoke** workflow runs on code pushes and pull
requests, or from **Actions → Cloud build and isolated API smoke → Run workflow**.
It uses Node 24.19.0, `npm ci`, `npm run build`, and `npm run test:api`.
The smoke test uses a temporary SQLite database, checks writes and persistence
after restarting the API, disables reminders and removes its own temporary data.
No root `.env`, OAuth, Telegram, Stripe or production database credentials are
required for this development check.

For an interactive cloud session:

```bash
npm ci
npm run build
npm run test:api
# Only when an interactive API preview is needed:
HABIT_REMINDERS_ENABLED=false npm run server
npm run dev
```

The API binds to loopback by default. Keep the preview private. Habit SQLite
state belongs on a persistent private volume via `HABIT_DB_PATH`, never in Git.
The static Pages UI cannot provide this database/API. Supervised source work and
isolated tests are available without claiming a hosted production API.

Reminder scheduling is disabled by default; no timer starts unless
`HABIT_REMINDERS_ENABLED=true` is explicitly supplied. Cloud checks always
override it to false and clear Telegram credentials. Deployment and external
data refresh workflows are now manual-only; these setup/test pushes do not
deploy or run recurring refresh jobs. Live integrations require their own secure
environment bindings and separate authorization.
