# Fred Dashboard — Auto-Refresh Review
*Built by CoderClint. Branch: feature/auto-refresh. 2026-04-16*

---

## What Was Built

Two files added/updated:

- `.github/workflows/refresh-dashboard.yml` — daily cron (02:00 UTC / 09:00 Bangkok) + manual trigger
- `scripts/refresh_data.py` — pulls Stripe MTD + FluentRx session count, surgically updates `index.html`

### What the script updates each run
| Field | Source |
|---|---|
| `STRIPE_DATA.mtd_revenue` | Stripe `payment_intents` API (restricted key, paginated) |
| `STRIPE_DATA.last_updated` | Today's date (dynamic, never hardcoded) |
| `GOAL.current` | Same as `mtd_revenue` |
| `SESSION_DATA.sessions_mtd` | FluentRx Postgres: completed appointments this month (non-fatal if DB unavailable) |

### What the script never touches
`TODOS`, `SOCIAL_QUEUE`, `BUILD_LOG`, `ROADMAP`, `MANUAL_DATA`, `SESSION_DATA.active_students`, all CSS, all render JS.

---

## GitHub Secrets — Add These Now

Go to: **github.com/clintryan/fred-dashboard → Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | Heroku dashboard → fluent-rx app → Settings → Config Vars → `STRIPE_SECRET_KEY` |
| `HEROKU_API_KEY` | heroku.com → click avatar → Account Settings → scroll to "API Key" → Reveal |
| `GH_PAT` | github.com → Settings → Developer settings → Fine-grained tokens → New token. Grant: **Contents: Read and Write** on the `fred-dashboard` repo only. |
| `DATABASE_URL` | Run: `heroku config:get DATABASE_URL --app fluent-rx` |

---

## How to Test

### Manual trigger
1. Go to github.com/clintryan/fred-dashboard → Actions → "Refresh Dashboard Data"
2. Click "Run workflow" → Run
3. Watch the run log — should end with: `Updated: Stripe MTD=$XXX, sessions=XX, date=YYYY-MM-DD`
4. Open clintryan.github.io/fred-dashboard — Revenue MTD and last_updated should reflect today
5. Check repo commits — should have `Auto-refresh: YYYY-MM-DD`

### Failure test (important)
1. Temporarily set `STRIPE_SECRET_KEY` to a bad value in GitHub Secrets
2. Trigger manually
3. Run should fail with non-zero exit — `index.html` must NOT be committed (no stale date)
4. Restore the correct key

### FluentRx sessions
If `DATABASE_URL` is set correctly, `sessions_mtd` in the dashboard will update.
If the DB is unreachable, the script logs a warning and continues — Stripe data still commits.

---

## Merge Checklist

- [ ] All 4 secrets added to GitHub repo settings
- [ ] Manual trigger test passes (Actions log shows `Updated: Stripe MTD=$...`)
- [ ] Dashboard at clintryan.github.io/fred-dashboard shows current Stripe MTD
- [ ] Repo has `Auto-refresh: YYYY-MM-DD` commit in history
- [ ] Failure test confirms no stale commit on bad key
- [ ] Merge `feature/auto-refresh` → `main`
