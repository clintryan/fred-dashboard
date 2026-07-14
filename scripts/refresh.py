#!/usr/bin/env python3
"""Pull Stripe MTD revenue + FluentRx session count and patch src/data/static.ts.

Reads STRIPE_SECRET_KEY and DATABASE_URL from env.
Exits non-zero on any Stripe API failure — never writes stale data.
FluentRx DB failures are non-fatal (sessions_mtd stays unchanged).
"""

import base64
import datetime
import json
import os
import re
import sys
import urllib.request
import urllib.error

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_TS  = os.path.join(SCRIPT_DIR, "..", "src", "data", "static.ts")


def get_stripe_mtd(api_key: str) -> int:
    month_start = datetime.date.today().replace(day=1)
    created_gte = int(datetime.datetime.combine(month_start, datetime.time.min).timestamp())
    auth = base64.b64encode(f"{api_key}:".encode()).decode()
    total_cents = 0
    starting_after = None

    while True:
        url = f"https://api.stripe.com/v1/payment_intents?limit=100&created[gte]={created_gte}"
        if starting_after:
            url += f"&starting_after={starting_after}"
        req = urllib.request.Request(url, headers={"Authorization": f"Basic {auth}"})
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read())
        except urllib.error.HTTPError as e:
            print(f"Stripe API error {e.code}: {e.read().decode(errors='replace')}", file=sys.stderr)
            sys.exit(1)
        for pi in data["data"]:
            if pi["status"] == "succeeded":
                total_cents += pi["amount"]
        if data.get("has_more") and data["data"]:
            starting_after = data["data"][-1]["id"]
        else:
            break

    return total_cents // 100


def get_fluentrx_sessions(database_url: str) -> int | None:
    try:
        import psycopg2
    except ImportError:
        print("psycopg2 not installed — skipping FluentRx query", file=sys.stderr)
        return None
    try:
        month_start = datetime.date.today().replace(day=1)
        conn = psycopg2.connect(database_url, sslmode="require")
        cur  = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM appointments WHERE start_time >= %s AND status = 'completed'", (month_start,))
        count = cur.fetchone()[0]
        conn.close()
        return int(count)
    except Exception as e:
        print(f"FluentRx DB query failed (non-fatal): {e}", file=sys.stderr)
        return None


def update_static_ts(mtd_revenue: int, sessions_mtd: int | None) -> None:
    with open(STATIC_TS, "r") as f:
        src = f.read()

    today = datetime.date.today().isoformat()

    # Patch STRIPE_DATA
    src, n1 = re.subn(r"(mtd_revenue:\s*)\d+",  rf"\g<1>{mtd_revenue}", src, count=1)
    src, n2 = re.subn(r'(last_updated:\s*")[^"]*"', rf'\g<1>{today}"', src, count=1)
    # Patch GOAL.current (anchored via target line)
    src, n3 = re.subn(
        r"(target:\s*\d+,\s*\n\s*current:\s*)\d+",
        rf"\g<1>{mtd_revenue}",
        src, count=1
    )

    if not all([n1, n2, n3]):
        print(f"Regex failures: mtd_revenue={n1}, last_updated={n2}, GOAL.current={n3}", file=sys.stderr)
        sys.exit(1)

    if sessions_mtd is not None:
        src, n4 = re.subn(r"(sessions_mtd:\s*)\d+", rf"\g<1>{sessions_mtd}", src, count=1)
        if not n4:
            print("Warning: sessions_mtd not found in static.ts — skipped", file=sys.stderr)

    with open(STATIC_TS, "w") as f:
        f.write(src)

    print(f"Updated: Stripe MTD=${mtd_revenue}, sessions={sessions_mtd}, date={today}")


def main():
    api_key = os.environ.get("STRIPE_SECRET_KEY")
    if not api_key:
        print("STRIPE_SECRET_KEY not set", file=sys.stderr)
        sys.exit(1)

    mtd_revenue  = get_stripe_mtd(api_key)
    sessions_mtd = None
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        sessions_mtd = get_fluentrx_sessions(database_url)
    else:
        print("DATABASE_URL not set — skipping FluentRx session count", file=sys.stderr)

    update_static_ts(mtd_revenue, sessions_mtd)


if __name__ == "__main__":
    main()
