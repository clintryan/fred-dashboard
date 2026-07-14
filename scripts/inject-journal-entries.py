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

    # Find and replace existing JOURNAL_ENTRIES section
    start_marker = "export const JOURNAL_ENTRIES: JournalEntry[] = ["
    end_marker = "\n]"

    start_idx = src.find(start_marker)
    if start_idx != -1:
        # Find the closing ] on a new line
        search_start = start_idx + len(start_marker)
        bracket_count = 1
        i = search_start
        while i < len(src) and bracket_count > 0:
            if src[i] == '[':
                bracket_count += 1
            elif src[i] == ']':
                bracket_count -= 1
            i += 1

        if bracket_count == 0:
            end_idx = i  # Position after the closing ]
            # Replace from start marker to closing bracket
            replacement = start_marker + "\n" + "  " + new_entries_block.replace("\nexport const JOURNAL_ENTRIES: JournalEntry[] = [\n", "").rstrip() + "\n]"
            src = src[:start_idx] + replacement + src[end_idx:]
        else:
            # Fallback: append before PERSONAS
            personas_idx = src.find("\n/* ── Persona config ── */")
            if personas_idx != -1:
                src = src[:personas_idx] + "\n\n" + new_entries_block + src[personas_idx:]
    else:
        # JOURNAL_ENTRIES not found, append before PERSONAS
        personas_idx = src.find("\n/* ── Persona config ── */")
        if personas_idx != -1:
            src = src[:personas_idx] + "\n\n" + new_entries_block + src[personas_idx:]
        else:
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
