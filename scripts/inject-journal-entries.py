#!/usr/bin/env python3
"""
inject-journal-entries.py — Parse journal.jsonl and inject JOURNAL_ENTRIES into src/data/static.ts

Reads the canonical journal at fred/Mission-Control/journal/journal.jsonl,
filters entries with run_id, and generates a TypeScript const for React routing.

Usage: python3 scripts/inject-journal-entries.py
"""

import json
import re
import sys
from pathlib import Path

JOURNAL_FILE = Path(__file__).resolve().parent.parent.parent.parent / "fred" / "Mission-Control" / "journal" / "journal.jsonl"
STATIC_TS = (Path(__file__).resolve().parent / ".." / "src" / "data" / "static.ts").resolve()

MAX_ENTRIES = 50


def load_journal_entries() -> list:
    """Load and parse journal.jsonl, return entries with run_id."""
    if not JOURNAL_FILE.exists():
        return []

    entries = []
    for line in JOURNAL_FILE.read_text(errors="replace").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            e = json.loads(line)
            # Only include entries that have a run_id (relevant for closeout)
            if e.get("run_id"):
                entries.append(e)
        except json.JSONDecodeError:
            continue

    # Sort by timestamp descending (newest first)
    entries.sort(key=lambda e: e.get("ts", ""), reverse=True)
    return entries[:MAX_ENTRIES]


def escape_string(s: str) -> str:
    """Escape string for TypeScript/JavaScript."""
    if s is None:
        return '""'
    return json.dumps(str(s))


def build_typescript_entries(entries: list) -> str:
    """Generate TypeScript const JOURNAL_ENTRIES array."""
    lines = []
    lines.append("/* ── Journal Entries — parsed from journal.jsonl for entry detail pages ── */")
    lines.append("export const JOURNAL_ENTRIES: JournalEntry[] = [")

    for e in entries:
        ts_str = escape_string(e.get("ts", ""))
        run_id = escape_string(e.get("run_id", ""))
        harness = escape_string(e.get("harness", ""))
        machine = escape_string(e.get("machine", ""))
        project = escape_string(e.get("project", "unknown"))
        persona = escape_string(e.get("persona", "Fred"))
        status = escape_string(e.get("status", "partial"))
        summary = escape_string(e.get("summary", ""))
        tokens = escape_string(e.get("tokens", ""))
        resume = escape_string(e.get("resume", ""))
        event = escape_string(e.get("event", ""))

        # Build files_changed array
        files_changed = e.get("files_changed", [])
        files_js = "["
        if files_changed:
            files_js += ", ".join(escape_string(f) for f in files_changed[:15])
        files_js += "]"

        # Build followups array
        followups = e.get("followups", [])
        followups_js = "["
        if followups:
            followups_js += ", ".join(escape_string(f) for f in followups[:10])
        followups_js += "]"

        lines.append(
            f"  {{\n"
            f"    ts: {ts_str},\n"
            f"    run_id: {run_id},\n"
            f"    harness: {harness},\n"
            f"    machine: {machine},\n"
            f"    project: {project},\n"
            f"    persona: {persona},\n"
            f"    status: {status},\n"
            f"    summary: {summary},\n"
            f"    files_changed: {files_js},\n"
            f"    tokens: {tokens},\n"
            f"    resume: {resume},\n"
            f"    event: {event},\n"
            f"    followups: {followups_js},\n"
            f"  }},"
        )

    lines.append("]")
    return "\n".join(lines)


def inject_into_static_ts(entries: list) -> None:
    """Read static.ts, replace/inject JOURNAL_ENTRIES, write back."""
    if not STATIC_TS.exists():
        print(f"static.ts not found at {STATIC_TS}", file=sys.stderr)
        sys.exit(1)

    src = STATIC_TS.read_text(encoding="utf-8")

    # Import type if not present
    if "JournalEntry" not in src:
        # Add to import
        src = src.replace(
            "import type {\n  Todo, AgentSession, SocialPost, FridayFixEntry, BuildEntry, RoadmapItem,\n  StripeData, ManualData, SessionData, GoalData\n}",
            "import type {\n  Todo, AgentSession, SocialPost, FridayFixEntry, BuildEntry, RoadmapItem,\n  StripeData, ManualData, SessionData, GoalData, JournalEntry\n}"
        )

    new_entries_block = build_typescript_entries(entries)

    # Check if JOURNAL_ENTRIES already exists
    pattern = r"\/\* ── Journal Entries .*?\n(?:export const JOURNAL_ENTRIES:.*?\n\];)"
    match = re.search(pattern, src, re.DOTALL)

    if match:
        # Replace existing block (avoid backslash issues)
        src = src[:match.start()] + new_entries_block + src[match.end():]
    else:
        # Append after ROADMAP block using string search instead of regex
        roadmap_end = src.rfind("export const ROADMAP:")
        if roadmap_end != -1:
            # Find the closing bracket
            bracket_count = 0
            found_start = False
            for i in range(roadmap_end, len(src)):
                if src[i] == '[':
                    found_start = True
                    bracket_count += 1
                elif src[i] == ']' and found_start:
                    bracket_count -= 1
                    if bracket_count == 0:
                        insert_pos = i + 1
                        src = src[:insert_pos] + "\n\n" + new_entries_block + src[insert_pos:]
                        break
        else:
            # Last resort: append before PERSONAS config
            src = src.rstrip() + "\n\n" + new_entries_block + "\n"

    STATIC_TS.write_text(src, encoding="utf-8")
    print(f"Injected {len(entries)} journal entries into {STATIC_TS.name}")


def main():
    entries = load_journal_entries()
    if not entries:
        print("No journal entries found with run_id — skipping injection", file=sys.stderr)
        return

    inject_into_static_ts(entries)


if __name__ == "__main__":
    main()
