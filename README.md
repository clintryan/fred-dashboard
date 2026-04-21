# fred-dashboard

Fred's internal Command Center dashboard — a self-contained single-file HTML
app (inline CSS + inline JS) that surfaces KPIs, the calendar, todos, the
build log, and the social queue for Clint at a glance.

## What this is

`index.html` is the whole app. It has:

- Inline CSS + inline JS — no build step, no bundler, no npm.
- One outbound `fetch()` to an external API (Google Calendar). Everything else
  renders from inline data arrays.
- Content sections (`BUILD_LOG`, `SOCIAL_QUEUE`, `TODOS`) that Fred inlines at
  session start by editing the HTML directly — they are **not** loaded from
  disk at runtime.

## History

Migrated 2026-04-21 from `~/command/fred/Mission-Control/dashboard.html` into
its own repo under `~/command/code/fred-dashboard/` to match the rule that
every dashboard lives in its own repo under `~/command/code/<name>/`.

## Deployment

Historically deployed by copying to the separate public `clintryan/fred-dashboard`
GitHub Pages repo. With this migration, this folder IS the source of truth — the
GitHub remote can be pointed directly at it.

## Usage

Open `index.html` in a browser. That's it.
