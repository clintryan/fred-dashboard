# Active Task — fred-dashboard auto-refresh

**Full spec:** `~/command/fred/CoderClint/fred-dashboard/SPEC-dashboard-auto-refresh.md`
Read the spec first. Everything you need is there.

## Summary
Build a GitHub Actions workflow that pulls live Stripe MTD revenue daily and updates `index.html` automatically — so the dashboard is never manually stale.

## Key constraints
- The Stripe restricted key (`rk_live_...`) only has `payment_intents` read access — use that endpoint only, NOT `charges` or `balance_transactions` (both return 403)
- Only 3 fields in `index.html` get updated: `mtd_revenue`, `last_updated`, `GOAL.current` — use surgical regex, touch nothing else
- `sessions_mtd` update via Heroku is optional for Phase 1 — skip it if Heroku dyno polling is complex, ship Stripe-only first
- Month start must be computed dynamically (not hardcoded to April 2026)

## Files to create
- `.github/workflows/refresh-dashboard.yml`
- `scripts/refresh_data.py`

## Secrets required (Clint adds these to GitHub before first run)
- `STRIPE_SECRET_KEY` — the `rk_live_...` restricted key
- `HEROKU_API_KEY` — from heroku.com Account Settings
- `GH_PAT` — fine-grained PAT, `fred-dashboard` repo, `contents: write`

## Done when
1. `python3 scripts/refresh_data.py` runs locally with env vars set and updates `index.html` correctly
2. `.github/workflows/refresh-dashboard.yml` is valid YAML, runs on schedule + manual trigger
3. If Stripe API call fails, script exits non-zero and does NOT write a stale date to the file
