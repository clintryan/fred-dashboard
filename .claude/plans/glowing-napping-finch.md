# Plan: Dashboard Auto-Refresh (Stripe MTD)

## Context
The Fred Dashboard (`clintryan.github.io/fred-dashboard`) is a single static HTML file on GitHub Pages. All data lives in a `<script>` block at the top. Stripe MTD revenue was going 11 days stale because it required manual updates. The Stripe restricted key (`rk_live_...`) is confirmed working against the `payment_intents` endpoint. This plan automates the daily pull via GitHub Actions.

**Phase 1 scope**: Stripe-only. Skip Heroku session count (complex async dyno polling). Ship Stripe, add sessions later.

## Files to Create

### 1. `scripts/refresh_data.py`

Python script (stdlib only — no pip install needed) that:

1. **Reads** `STRIPE_SECRET_KEY` from env (exits non-zero if missing)
2. **Computes** month start dynamically: `datetime.date.today().replace(day=1)` → Unix timestamp
3. **Calls** Stripe `payment_intents` endpoint with `created[gte]` filter, paginating if `has_more` is true
4. **Sums** `amount` for `status == 'succeeded'` entries, divides by 100 (cents → dollars)
5. **Reads** `index.html` from repo root
6. **Updates exactly 3 fields** via regex:
   - `mtd_revenue: NNN` inside `STRIPE_DATA` block
   - `last_updated: "YYYY-MM-DD"` inside `STRIPE_DATA` block
   - `current: NNN` inside `GOAL` block (line 557 only — NOT line 1163)
7. **Writes** updated `index.html` back
8. **Prints** summary to stdout

**Regex strategy** (avoiding false matches):
- `mtd_revenue` and `last_updated` are unique strings — simple `(mtd_revenue:\s*)\d+` works
- `current:` appears on two lines (557 and 1163). Anchor to the GOAL block: use a two-line regex matching `target:` on the preceding line, then `current:` on the next — with `re.DOTALL`. This guarantees we only touch the GOAL declaration, not the render reference on line 1163.

**Error handling**: If the Stripe API returns non-200, print the error and `sys.exit(1)` immediately — never write to index.html on failure.

**Key data locations in index.html** (verified):
- Line 534: `mtd_revenue:  516,`
- Line 536: `last_updated: "2026-04-16"`
- Line 557: `current:  516,`

### 2. `.github/workflows/refresh-dashboard.yml`

GitHub Actions workflow:

```yaml
name: Refresh Dashboard Data
on:
  schedule:
    - cron: '0 2 * * *'   # 02:00 UTC daily (09:00 Bangkok)
  workflow_dispatch:        # Manual trigger

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GH_PAT }}

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Refresh dashboard data
        env:
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        run: python scripts/refresh_data.py

      - name: Commit and push
        run: |
          git config user.name "Fred Bot"
          git config user.email "cryptoklint@gmail.com"
          git add index.html
          git diff --staged --quiet || git commit -m "Auto-refresh: $(date +%Y-%m-%d)"
          git push
```

Key details:
- Uses `GH_PAT` for checkout so the push has write permission
- No `HEROKU_API_KEY` in Phase 1 (Stripe-only)
- `git diff --staged --quiet ||` prevents empty commits when data hasn't changed

## Secrets Clint Must Add

| Secret | Source |
|---|---|
| `STRIPE_SECRET_KEY` | The `rk_live_...` restricted key |
| `GH_PAT` | Fine-grained PAT, `fred-dashboard` repo, `contents: write` |

## Verification

1. Set `STRIPE_SECRET_KEY` env var locally, run `python3 scripts/refresh_data.py` — confirm index.html updates the 3 fields and nothing else
2. `git diff index.html` — should show only mtd_revenue, last_updated, and GOAL.current changes
3. Unset `STRIPE_SECRET_KEY`, run script — should exit non-zero, index.html unchanged
4. Validate workflow YAML syntax
5. After pushing to GitHub + adding secrets: manual trigger via Actions UI, verify commit appears
