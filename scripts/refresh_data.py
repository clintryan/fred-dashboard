#!/usr/bin/env python3
"""Pull Stripe MTD revenue + FluentRx session count and update fred-dashboard/index.html.

Reads STRIPE_SECRET_KEY and DATABASE_URL from env.
Uses only the payment_intents endpoint (the restricted key has no access to
charges or balance_transactions).
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
INDEX_PATH = os.path.join(SCRIPT_DIR, "..", "index.html")


def get_stripe_mtd(api_key: str) -> int:
    """Return MTD succeeded revenue in whole dollars, paginating if needed."""
    month_start = datetime.date.today().replace(day=1)
    created_gte = int(datetime.datetime.combine(month_start, datetime.time.min).timestamp())
    auth = base64.b64encode(f"{api_key}:".encode()).decode()

    total_cents = 0
    starting_after = None

    while True:
        url = (
            f"https://api.stripe.com/v1/payment_intents"
            f"?limit=100&created[gte]={created_gte}"
        )
        if starting_after:
            url += f"&starting_after={starting_after}"

        req = urllib.request.Request(url, headers={"Authorization": f"Basic {auth}"})
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read())
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")
            print(f"Stripe API error {e.code}: {body}", file=sys.stderr)
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
    """Query FluentRx Postgres for completed sessions this month.

    Returns session count or None on any error (non-fatal).
    """
    try:
        import psycopg2  # installed via pip in workflow
    except ImportError:
        print("psycopg2 not installed — skipping FluentRx query", file=sys.stderr)
        return None

    try:
        month_start = datetime.date.today().replace(day=1)
        conn = psycopg2.connect(database_url, sslmode="require")
        cur = conn.cursor()
        cur.execute(
            "SELECT COUNT(*) FROM appointments"
            " WHERE start_time >= %s AND status = 'completed'",
            (month_start,),
        )
        count = cur.fetchone()[0]
        conn.close()
        return int(count)
    except Exception as e:
        print(f"FluentRx DB query failed (non-fatal): {e}", file=sys.stderr)
        return None


def update_html(mtd_revenue: int, sessions_mtd: int | None = None) -> None:
    """Surgically update 3 required fields (+ optionally sessions_mtd) in index.html."""
    with open(INDEX_PATH, "r") as f:
        html = f.read()

    today = datetime.date.today().isoformat()

    # 1. STRIPE_DATA.mtd_revenue  (unique string)
    html, n1 = re.subn(r"(mtd_revenue:\s*)\d+", rf"\g<1>{mtd_revenue}", html, count=1)

    # 2. STRIPE_DATA.last_updated (unique string)
    html, n2 = re.subn(r'(last_updated:\s*")[^"]*"', rf'\g<1>{today}"', html, count=1)

    # 3. GOAL.current — anchored via preceding "target:" line to avoid matching
    #    the render-object reference later in the file
    html, n3 = re.subn(
        r"(target:\s*\d+,\s*\n\s*current:\s*)\d+",
        rf"\g<1>{mtd_revenue}",
        html,
        count=1,
    )

    if not all([n1, n2, n3]):
        print(
            f"Regex match failures: mtd_revenue={n1}, last_updated={n2}, GOAL.current={n3}",
            file=sys.stderr,
        )
        sys.exit(1)

    # 4. SESSION_DATA.sessions_mtd — optional, non-fatal if missing
    n4 = 0
    if sessions_mtd is not None:
        html, n4 = re.subn(
            r"(sessions_mtd:\s*)\d+",
            rf"\g<1>{sessions_mtd}",
            html,
            count=1,
        )
        if not n4:
            print("Warning: sessions_mtd field not found in HTML — skipped", file=sys.stderr)

    with open(INDEX_PATH, "w") as f:
        f.write(html)

    sessions_note = f", sessions={sessions_mtd}" if sessions_mtd is not None else ""
    print(f"Updated: Stripe MTD=${mtd_revenue}{sessions_note}, date={today}")


def main():
    api_key = os.environ.get("STRIPE_SECRET_KEY")
    if not api_key:
        print("STRIPE_SECRET_KEY not set", file=sys.stderr)
        sys.exit(1)

    mtd_revenue = get_stripe_mtd(api_key)

    sessions_mtd = None
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        sessions_mtd = get_fluentrx_sessions(database_url)
    else:
        print("DATABASE_URL not set — skipping FluentRx session count", file=sys.stderr)

    update_html(mtd_revenue, sessions_mtd)


if __name__ == "__main__":
    main()
