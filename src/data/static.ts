import type {
  Todo, AgentSession, SocialPost, FridayFixEntry, BuildEntry, RoadmapItem,
  StripeData, ManualData, SessionData, GoalData, JournalEntry
} from './types'

/* ── Auto-refreshed by GitHub Actions (scripts/refresh.py) ── */
export const STRIPE_DATA: StripeData = {
  mtd_revenue:  437,
  last_month:   950,
  last_updated: "2026-04-05"
}

/* ── Manual — Clint updates at session start ── */
export const MANUAL_DATA: ManualData = {
  teaching_mtd: 0,
  other_mtd:    0,
  note:         "Teaching starts May 5"
}

export const SESSION_DATA: SessionData = {
  sessions_mtd:        16,
  sessions_last_month: 38,
  active_students:     12,
  trials_mtd:          2
}

export const GOAL: GoalData = {
  target:   250,
  current:  0,
  deadline: "2026-04-30"
}

export const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE'

/* ── Todos: Fred reprioritizes each session ── */
export const TODOS: { must: Todo[]; should: Todo[]; could: Todo[] } = {
  must: [
    { id: 'newton-rejection', text: "Send Newton rejection — draft ready, to: brian.d@newton.ac.th, CC: joshua.e@newton.ac.th", tag: "teacher" },
    { id: 'bcc-contract',     text: "Chase BCC contract — signing April 10, 10am, BCC Silom. Contract not received.", tag: "teacher" },
    { id: 'nancy-lin',        text: "Nancy Lin — replied Apr 8. Offered weeknights 18–24 TW time + Sat 09–15 late April. Awaiting slot confirmation.", tag: "fluentrx" },
    { id: 'welcome-seq',      text: "Deploy welcome email sequence — 4 emails drafted, 3 checks before going live", tag: "fluentrx" },
  ],
  should: [
    { id: 'weekend-sched',  text: "Decide weekend schedule post-May 5 (how many sessions, which days)", tag: "fluentrx" },
    { id: 'price-raise',    text: "Price raise for new students — do alongside rebrand", tag: "fluentrx" },
    { id: 'rebrand',        text: "FluentRx rebrand — brainstorm done, pick direction + domain", tag: "fluentrx" },
    { id: 'italki',         text: "italki profile setup — approved, never configured. Zero-cost acquisition.", tag: "fluentrx" },
    { id: 'fluentrx-down',  text: "Take fluentrx.com down / make private before May 5 (work permit)", tag: "fluentrx" },
    { id: 'stripe-api',     text: "Call Stripe API — verify restricted key, pull April revenue data", tag: "fred" },
  ],
  could: [
    { id: 'marketplace',   text: "Update AmazingTalker, Preply, italki profiles — stale, wrong brand voice", tag: "fluentrx" },
    { id: 'fiverr',        text: "First Fiverr/Upwork listing — AI workflow automations angle", tag: "coder" },
    { id: 'resumes',       text: "Update all 3 resumes — replace Toronto with Bangkok", tag: "fred" },
    { id: 'crypto-bot',    text: "Crypto bot project — waiting on Paradise's training docs", tag: "trader" },
    { id: 'ai-tutor',      text: "AI tutor agent moonshot (CoderClint × FluentRx crossover)", tag: "coder" },
    { id: 'voice-agent',   text: "Voice agent first build — high potential, never built one", tag: "coder" },
  ]
}

/* ── Agent Sessions — Fred updates from handoffs/*.md ── */
export const AGENT_SESSIONS: AgentSession[] = [
  // { id: 'worksheet-html', task: 'Worksheet generator — local HTML', tag: 'fluentrx', status: 'active', since: '2026-04-08', todoId: 'welcome-seq' },
]

/* ── Social Queue — synced from social-queue.md ── */
export const SOCIAL_QUEUE: SocialPost[] = [
  { date: '2026-04-10', persona: '@__fluentrx__', tag: 'fluentrx', draft: "Swapping \"but\" for \"however\" is the same word, same meaning.\n\nBut one belongs in a business email and the other belongs in a text message.\n\nThis week's Friday Fix: the 4 connector swaps that instantly raise your register.\n\nFree: fluentrx.com/friday-fix/raise-your-register-connectors", status: 'draft' },
  { date: '2026-04-10', persona: '@__fluentrx__', tag: 'fluentrx', draft: "Know when to use \"consequently\" vs \"therefore\"?\n\nMost advanced learners don't. (It's not obvious.)\n\nFree practice sheet this week — 3 exercises, answer key included.\n\nfluentrx.com/practice/raise-your-register-connectors", status: 'draft' },
  { date: '2026-04-10', persona: '@__teacherclint__', tag: 'teacher', draft: "One thing I notice in almost every advanced student's writing:\n\nThey use \"but\" and \"so\" where a native speaker would use \"however\" and \"consequently.\"\n\nIt's not wrong. It just sounds casual. And sometimes that matters a lot.\n\nNew Friday Fix on this 👇\nfluentrx.com/friday-fix/raise-your-register-connectors", status: 'draft' },
  { date: '2026-04-10', persona: '@__teacherclint__', tag: 'teacher', draft: "Quick question for advanced English learners:\n\nDo you know the punctuation rule for formal connectors?\n\n(Most people get this wrong even when they know the words.)\n\nAnswer in this week's free email: fluentrx.com/friday-fix/raise-your-register-connectors", status: 'draft' },
]

/* ── Friday Fix Work Log ── */
export const FRIDAY_FIX_LOG: FridayFixEntry[] = [
  { date: '2026-04-15', type: 'decision', status: 'done',    text: 'Coupon standardised: FRIDAYFIX = 10% off. Retired FRIDAYFIX20. Reason: avoid coupon fatigue before 5-year anniversary promo.' },
  { date: '2026-04-15', type: 'task',     status: 'done',    text: 'April 17 TBS card populated: TBS-119 · The Business of Prediction Markets (auto-fetched from Lesson Library sheet row 2).' },
  { date: '2026-04-15', type: 'task',     status: 'pending', text: "April 17 — deploy + send via Mail Meteor. Clint's action." },
  { date: '2026-04-15', type: 'idea',     status: 'pending', text: 'Rails endpoint for TBS episode data: GET /api/v1/friday_fix_episode — removes need for Chrome auth to read sheet.' },
  { date: '2026-04-10', type: 'task',     status: 'done',    text: 'April 10 — sent via Mail Meteor. Variant A (platform cut).' },
  { date: '2026-04-08', type: 'decision', status: 'done',    text: 'Format rules locked: .bq single-line corrections, text logo, TBS thumbnail unclickable, no academic terms.' },
  { date: '2026-04-08', type: 'idea',     status: 'pending', text: 'FridayFix.gs — Apps Script sender to replace Mail Meteor. Tabled until April 17 is shipped.' },
  { date: '2026-04-07', type: 'idea',     status: 'pending', text: 'Welcome email sequence (4 emails, Day 0/3/7/12). Draft in _context.md. Needs FRIDAYFIX coupon in app. High priority.' },
]

/* ── Build Log — synced from build-log.md ── */
export const BUILD_LOG: BuildEntry[] = [
  { date: "2026-04-27", title: "TBS-120 Worksheet Blocked — YouTube Transcript Fetch Failure", description: "Attempted TBS-120 worksheet (7-Eleven / Couche-Tard, video dANVoA7MSHE). youtube_transcript_api v1.2.4 returned RequestBlocked — YouTube rate-limiting or bot detection on local IP. yt-dlp with browser cookies also failed. No content generated. Next step: resolve transcript fetch before retrying.", type: "infra", tag: "fluentrx" },
  { date: "2026-04-26", title: "TBS-092: Australia Economy Worksheet", description: "Generated and published TBS-092 'The Lucky Country's Economic Reckoning' — full FluentRx worksheet from a CNBC video on Australia's per capita recession. Content bank (3 passes) + Fluency variant posted to Rails API. Also fixed FLUENTRX_WEBHOOK_SECRET missing from .env.", type: "automation", tag: "fluentrx" },
  { date: "2026-04-16", title: "Session Duration-Based Income Calculation", description: "Added duration-aware income calculation to the Appointment model. 25-min sessions calculate at 60% of the base rate, 50-min at 100%, and 80/90-min at 150%. Also added Appointment.monthly_income for the dashboard auto-refresh. No migration needed — duration derived from existing timestamps. Verified in Rails console with correct results ($15, $25, $37.50). Deployed as v445.", type: "feature", tag: "fluentrx" },
  { date: "2026-04-16", title: "Sprint Methodology + 3 IDE Agent Handoffs", description: "Established the 14-day sprint methodology for the Max→Pro token window. Three handoffs written and queued: (1) FluentRx session pricing for 25-min/90-min durations, (2) Dashboard auto-refresh via GitHub Actions pulling Stripe MTD + Heroku income, (3) Dashboard full rebuild in React + Vite + ShadCN/UI.", type: "infra", tag: "coder" },
  { date: "2026-04-16", title: "CoderClint Gmail Mailer: OAuth + send-email.py", description: "Wired up a full Gmail API email system for CoderClint. Authenticated cryptoklint@gmail.com via OAuth. Built send-email.py — hardcoded allowlist of four project addresses, In-Reply-To threading, thread state persisted in email-threads.json. All four project inboxes confirmed receiving.", type: "infra", tag: "coder" },
  { date: "2026-04-15", title: "Deploy Gate Rules + Bridge Protocol Hardening", description: "After a production incident (curly quote 500 on homepage), hardened the multi-agent deployment workflow. IDE agents are now prohibited from any git push or heroku command. All fluent-rx deploys go through a mandatory deploy gate.", type: "infra", tag: "fred" },
  { date: "2026-04-15", title: "Late Cancel Bug Fix", description: "Fixed a bug where a cancellation made 22+ hours before a session was incorrectly recorded as a late cancel. Root cause: the cancel action delegated all DB updates to the Cal.com webhook, which could arrive after the 12-hour late-cancel threshold if Cal.com retried a delayed delivery.", type: "fix", tag: "fluentrx" },
  { date: "2026-04-15", title: "Homepage Visual Polish", description: "Tightened the homepage spacing and sharpened the type hierarchy across the brand-design-overhaul branch. Hero padding cut by 37%, all section padding reduced by ~33%, eyebrow labels now read as intentional small-caps, headings bumped to extrabold.", type: "feature", tag: "fluentrx" },
  { date: "2026-04-15", title: "Marketplace Sync: 12-Hour Booking Window", description: "MarketplaceSyncService was booking AmazingTalker sessions up to 48 hours in advance, but AT allows free cancellations within 12 hours — creating phantom Cal.com bookings. Narrowed the sync window to 12 hours. Heroku Scheduler also changed from daily to hourly.", type: "fix", tag: "fluentrx" },
  { date: "2026-04-15", title: "Student Snapshot + fred:snapshot Rake Task Verified", description: "Fixed and ran the student package snapshot runner on Heroku production — 22 paying students captured with ACTIVE/LAPSED/NO_CREDITS/EXPIRING_SOON status for the Wednesday MailMeteor re-engagement campaign.", type: "infra", tag: "fluentrx" },
  { date: "2026-04-14", title: "Font Unification + Scroll Animation + Card Icons", description: "Completed the typography overhaul by dropping Playfair Display entirely — all headings now use Inter at extrabold (800) and bold (700) weights with tight letter-spacing. Added scroll entrance animation to all 16 Talk Business workflow cards using IntersectionObserver with 80ms stagger.", type: "feature", tag: "fluentrx" },
  { date: "2026-04-13", title: "Brand Voice + Visual Overhaul: Typography, Copy, Footer, Components", description: "Full outward-facing site overhaul across copy and design. Added Playfair Display serif font to all headings. Fixed responsive font scale. Built new shared/_steps_flow.html.erb component. Rewrote copy on homepage, about, pricing, welcome, and client results pages.", type: "feature", tag: "fluentrx" },
  { date: "2026-04-13", title: "Heroku Deploy Fix + B06 Backfill: v428 Live", description: "Resolved Heroku push rejection caused by a rogue @esbuild/linux-arm64 devDependency. Removed the bad dep, regenerated yarn.lock, pushed clean as v427. All 6 migrations ran clean including the 3 learning graph tables. Backfill processed 21 session reports.", type: "infra", tag: "fluentrx" },
  { date: "2026-04-13", title: "Worksheet HTML Renderer: 16:9 Card Deck + Student Share Link", description: "Rebuilt the FluentRx worksheet show view from scratch. Each enabled section displays as a 16:9 card in a scroll-snap deck — one card per section, projector-ready. Teachers get a collapsible section picker with a 'Copy student link' button.", type: "feature", tag: "fluentrx" },
  { date: "2026-04-13", title: "Student Learning Graph: Relational Tables for Scores + Vocabulary", description: "Lifted rubric scores and vocabulary items out of JSON blobs in session reports and into three proper relational tables: session_assessments, learned_vocabulary, and student_progress_snapshots.", type: "infra", tag: "fluentrx" },
  { date: "2026-04-12", title: "Marketing Overhaul: 3 Courses, Clean Brand Voice", description: "Collapsed FluentRx from 4 course tracks to 3: Talk Business, Workplace Situations, and Interview Prep. Dropped Exam Prep, Future Leaders, and Educators entirely — old URLs redirect to home.", type: "feature", tag: "fluentrx" },
  { date: "2026-04-11", title: "Session Report Rubric Assessment & Spider Chart — Merged + Deployed", description: "Session reports now capture structured assessment data across 6 rubric dimensions (task completion, grammar, vocabulary, fluency, engagement, pronunciation) with 0-10 scores. A new Assessment tab renders a radar/spider chart using Chart.js.", type: "feature", tag: "fluentrx" },
  { date: "2026-04-09", title: "Practice Tab Fix + Claude API Timeout Increase", description: "Two fixes shipped together. The Practice tab in every session report was always empty — Claude was outputting exercises under `practice_exercises` but the view expected `practice.questions`. Also bumped the Faraday read timeout from 120s to 300s.", type: "fix", tag: "fluentrx" },
  { date: "2026-04-09", title: "Marketplace Sync — DB Write Fix + Cowork Skill Retired", description: "The marketplace sync was creating Cal.com bookings but never writing appointments to the FluentRx DB — it relied on a Cal.com webhook round-trip that doesn't fire for API-created bookings. Fixed MarketplaceSyncService to write Appointment records directly.", type: "fix", tag: "fluentrx" },
  { date: "2026-04-08", title: "Interview Prep Mode — Auto-detected Report Tab", description: "The FluentRx class report pipeline now auto-detects interview prep sessions and produces a richer report. When the transcript contains interview keywords, the report gains a new 🎤 Interview Q&A tab.", type: "feature", tag: "fluentrx" },
  { date: "2026-04-08", title: "Marketplace Sync Pipeline Fix + Heroku Scheduler", description: "AT and Preply bookings now sync into Cal.com automatically every morning. Fixed three compounding bugs: a pending DB migration, a missing Heroku Scheduler addon, and an HTTP 301 redirect that Ruby's Net::HTTP was silently swallowing.", type: "fix", tag: "fluentrx" },
  { date: "2026-04-07", title: "Marketplace Intake Skill — AT + Preply Student Onboarding", description: "Built a structured 8-step skill for onboarding new AmazingTalker or Preply students mid-package — retroactive session backfilling, order creation, Cal.com booking, and credit reconciliation.", type: "automation", tag: "fluentrx" },
  { date: "2026-04-07", title: "Marketplace Sync System — AmazingTalker + Preply → FluentRx + Cal.com", description: "Replaced a manual copy-paste booking workflow with a fully automated hourly Heroku job. Fetches AT and Preply iCal feeds, parses upcoming sessions, creates Cal.com bookings with availability bypass.", type: "automation", tag: "fluentrx" },
  { date: "2026-04-06", title: "Automated Class Report Pipeline", description: "After each class, Tactiq saves the transcript to Google Drive. Google pushes a notification to the FluentRx app, which fetches the transcript, calls the Claude API to generate a structured JSON session report, saves it to the student's profile, and emails them.", type: "automation", tag: "fluentrx" },
  { date: "2026-04-05", title: "Fred Dashboard — Live on GitHub Pages", description: "Built and deployed a personal command-center dashboard at clintryan.github.io/fred-dashboard. Dark command-center aesthetic. Tabs for each persona. MoSCoW kanban, KPI cards, upcoming calendar panel.", type: "feature", tag: "fred" },
  { date: "2026-04-01", title: "Session Report Generator — Live", description: "After each FluentRx class, a transcript is processed into a structured JSON report covering grammar corrections, pronunciation feedback, vocabulary items, talk-time analytics, and personalised next-session goals.", type: "automation", tag: "fluentrx" },
  { date: "2026-04-01", title: "Worksheet Generator — Live", description: "Generates Talk Business Series (TBS) worksheets from YouTube video transcripts. Two registers: formal and casual. Worksheets include vocabulary, discussion questions, and exercises.", type: "automation", tag: "fluentrx" },
]

/* ── Product Roadmap ── */
export const ROADMAP: RoadmapItem[] = [
  { phase: "1A", title: "Report Rubric Data", status: "active", target: "Apr 2026", description: "Extend session report JSON with 6 rubric dimensions. Add spider chart + next-session objectives to report HTML. Data accumulates silently — no change to student output yet.", branch: "feature/report-rubric-data", tag: "fluentrx" },
  { phase: "1B", title: "Split Dynamic Report into Partials", status: "queued", target: "Apr 2026", description: "_dynamic_report.html.erb is 853 lines / 19k tokens — exceeds IDE agent read limit. Split into ~10 partials so agents can work on individual sections cleanly.", branch: "feature/report-partials", tag: "fluentrx" },
  { phase: "2A", title: "Worksheet Section Checkboxes", status: "queued", target: "May 2026", description: "45 sections across pre/in/post-class. LLM generates full JSON in one call. Teacher toggles sections on/off. Display config stored separately — no re-generation needed.", branch: "feature/worksheet-sections", tag: "fluentrx" },
  { phase: "2B", title: "Student Profile Integration", status: "queued", target: "May 2026", description: "JSON profile per student (job, industry, goals, weaknesses, vocab mastered). Injected into worksheet generation prompt for personalised scenarios and questions.", branch: "feature/student-profiles", tag: "fluentrx" },
  { phase: "2C", title: "Worksheet Level Differentiation", status: "queued", target: "May 2026", description: "Scaffold toggle (B1/B2/C1). One worksheet generated, rendered with appropriate support layer. Parallel full versions as future premium feature.", branch: "feature/worksheet-sections", tag: "fluentrx" },
  { phase: "3",  title: "Student Learning Graph", status: "planned", target: "Jun 2026", description: "Three new DB tables: session_assessments, learned_vocabulary, student_progress_snapshots. Background job extracts rubric data + vocab from every session report.", branch: "feature/learning-graph", tag: "fluentrx" },
  { phase: "4",  title: "Flashcards", status: "planned", target: "Jul 2026", description: "Spaced repetition from learned_vocabulary. Cards carry context sentence from original session. Mobile-first web. Better than Anki because it's personalised to the student's own classes.", branch: "feature/flashcards", tag: "fluentrx" },
  { phase: "5",  title: "Periodic Progress Review", status: "planned", target: "Aug 2026", description: "Agent looks at last N sessions → structured progress report with spider chart trends + concrete transcript evidence. On-demand or scheduled. Premium add-on.", branch: "feature/progress-review", tag: "fluentrx" },
  { phase: "6",  title: "Teacher Input Step in Reports", status: "planned", target: "Sep 2026", description: "Teacher reviews AI draft → confirms/edits teacher-rated fields (pronunciation, engagement) → approves → report posts. New UI step before student notification.", branch: "feature/teacher-review", tag: "fluentrx" },
  { phase: "7",  title: "Teacher Tools SaaS", status: "vision", target: "Post-May 2026", description: "Worksheet generator (+ eventually full suite) sold to other ESL teachers. Entry price ~$15-29/mo. Built inside FluentRx Rails app — multi-tenant by teacher. Beat LinguaHouse on speed, customisation, price, personalisation.", branch: null, tag: "coder" },
  { phase: "8",  title: "AI Teacher Assistant", status: "vision", target: "2026–2027", description: "Agent with full access to student learning graph. Suggests session focus, flags plateaus, generates targeted exercises, supports async student practice. Amplifies the teacher — doesn't replace them.", branch: null, tag: "fluentrx" },
]

/* ── Journal Entries — parsed from journal.jsonl for entry detail pages ── */
export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    ts: "2026-07-15T06:06:00+07:00",
    run_id: "openclaw-20260715-chalk-workflow",
    harness: "openclaw",
    machine: "openclaw",
    project: "Chalk",
    persona: "Fred",
    status: "done",
    summary: "Added Chalk app to feature delivery system. Same pipeline as FluentRx but staging/shipping emails route to clintteacher@gmail.com instead of fluentrx@gmail.com. Updated Mission-Control/.fred-emails.json with chalk_workflow section. AGENTS.md now documents both FluentRx + Chalk workflows together.",
    files_changed: ["fred/Mission-Control/.fred-emails.json", "fred/AGENTS.md"],
    tokens: "unknown",
    resume: "Goal: two-app feature pipeline (FluentRx + Chalk) with email routing | Just done: config + docs for Chalk workflow (emails \u2192 clintteacher@gmail.com) | Next: Claude Code implements email infrastructure for both apps (shared cron/digests, dual routing) | Files: Mission-Control/.fred-emails.json, AGENTS.md",
    event: "pass",
    followups: [],
  },
  {
    ts: "2026-07-15T05:44:00+07:00",
    run_id: "openclaw-20260715-fluentrx-workflow",
    harness: "openclaw",
    machine: "openclaw",
    project: "FluentRx",
    persona: "Fred",
    status: "done",
    summary: "Built email-driven feature pipeline: Clint sends idea \u2192 Fred builds on feature branch \u2192 staging verification email to fluent-rx@gmail.com \u2192 Clint reviews (tests locally) \u2192 replies via email to approve or request changes \u2192 Fred executes (merge/prod/confirmation) or iterates. Five weekly HTML Kanban digests (Personal/FluentRx/ClintTeacher/Traderskinflint/CoderClint) always sent even if empty. Config saved to Mission-Control/.fred-emails.json. AGENTS.md + memory documented.",
    files_changed: ["fred/Mission-Control/.fred-emails.json", "fred/AGENTS.md", "fred/Mission-Control/MEMORY.md", "memory/project_fluentrx_workflow.md"],
    tokens: "unknown",
    resume: "Goal: structured feature-to-shipped pipeline for FluentRx | Just done: config + docs + memory for email workflow | Next: dispatch Claude Code to implement (1) cron jobs for 5 weekly digests, (2) email sending scripts (git parsing, HTML Kanban generation, Himalaya integration), (3) listener for incoming emails at cryptoklint@gmail.com, (4) auto-push to fred-dashboard on every commit. First test: send a FluentRx feature idea and verify staging email arrives. | Files: Mission-Control/.fred-emails.json (email config), AGENTS.md (workflow docs), memory/project_fluentrx_workflow.md (implementation status)",
    event: "pass",
    followups: [],
  },
  {
    ts: "2026-07-09T15:30:00+07:00",
    run_id: "cowork-20260709-journal-consolidation",
    harness: "cowork",
    machine: "cowork",
    project: "workspace",
    persona: "Fred",
    status: "done",
    summary: "Consolidated 6+ parallel logging/closeout mechanisms into ONE canonical journal: journal.jsonl (append-only) + tools/journal.py (only writer/renderer) + generated JOURNAL.md. Archived build-log.md, session-events/, log-event.py, CLOSEOUT-PROMPT.md, build-log skills, and the global-journal ticket into _archive/continuity-2026-07-09. Repointed AGENTS/STARTUP/close-skill/harnesses/agent-surfaces/dashboard/digest to the journal. Resume block now lives IN the entry, not a separate handoff file.",
    files_changed: ["tools/journal.py", "fred/Mission-Control/journal/journal.jsonl", "fred/Mission-Control/journal/README.md", "fred/AGENTS.md", "fred/Mission-Control/STARTUP.md", ".claude/skills/close/SKILL.md", ".claude/settings.json"],
    tokens: "unknown",
    resume: "Goal: one harness-agnostic continuity log for ~/command, no parallel mechanisms. | Just done: built tools/journal.py + journal.jsonl + generated JOURNAL.md, archived all 6 old mechanisms into _archive/continuity-2026-07-09, repointed every doc/script. | Next: adopt it \u2014 every pass ends with `python3 tools/journal.py add ...`; verify the Claude Code Stop-hook backstop fires on Clint's Mac. | Files: tools/journal.py, fred/Mission-Control/journal/README.md, fred/Mission-Control/journal/JOURNAL.md",
    event: "pass",
    followups: ["Clint runs the commit command on his Mac", "rm the 3 sandbox leftover files listed in the report"],
  },
  {
    ts: "2026-07-09T15:23:10.963444+07:00",
    run_id: "cowork-20260709-152310",
    harness: "cowork",
    machine: "cowork",
    project: "BCC",
    persona: "Nightingale",
    status: "done",
    summary: "Graded Product Poster (June 10) for 412/413 using new Product Poster Feedback Template, 11 groups across both classes, scores 6-8 (7 most common). One grading error found: a group's Canva link pointed to an outdated version, not the final submission.",
    files_changed: ["fred/ClintTeacher/BCC/personas/bcc-m4-nightingale.md"],
    tokens: "unknown",
    resume: "Goal: keep M4 grading current | Just done: Product Poster (June 10) graded for 11/? groups, feedback template established | Next: confirm group tracks/DQs, continue grading catch-up | Files: fred/ClintTeacher/BCC/personas/bcc-m4-nightingale.md",
    event: "pass",
    followups: ["Confirm group track/DQ per 412/413 (Open Item #2); grade remaining: Product Pitch Proposal (June 18), Product Pitch (June 25), 12-Week Project Schedule (July 8)"],
  },
  {
    ts: "2026-07-09T08:06:41+07:00",
    run_id: "backfill-20260709-agent-surfaces",
    harness: "cowork",
    machine: "air",
    project: "workspace",
    persona: "Fred",
    status: "partial",
    summary: "Built the agent-surface Google Doc mirror layer (agent-surfaces.md registry + render-agent-surface.py + sync-doc-to-drive.py hook). Reasonable READ surface, but was added as yet another layer without consolidating the older logging mechanisms \u2014 that consolidation is the 2026-07-09 later pass below.",
    files_changed: ["fred/Mission-Control/agent-surfaces.md", "tools/render-agent-surface.py", "tools/sync-doc-to-drive.py"],
    tokens: "unknown",
    resume: "",
    event: "backfill",
    followups: ["Consolidate all logging/closeout into ONE canonical mechanism"],
  },
  {
    ts: "2026-07-02T17:00:00+07:00",
    run_id: "backfill-20260702-matchday",
    harness: "cowork",
    machine: "air",
    project: "BCC",
    persona: "Isosceles",
    status: "done",
    summary: "Built Match Day Hunt 4.3 station-rotation review (9 stations + 2 bonus, 6 group routes, teacher key). Dropped invented match-history framing per Clint; used labelled hypotheticals + real class-list counts. All station math verified.",
    files_changed: ["4.3-matchday-hunt.html", "4.3-matchday-hunt-teacher-instructions.html"],
    tokens: "unknown",
    resume: "",
    event: "backfill",
    followups: [],
  },
  {
    ts: "2026-07-01T19:00:00+07:00",
    run_id: "backfill-20260701-eventlog",
    harness: "cowork",
    machine: "air",
    project: "workspace",
    persona: "Fred",
    status: "done",
    summary: "Fixed silently-broken session-events auto-logger (wrote to ephemeral sandbox ~/.command-log; hook used a Mac-absolute path that can't launch in Cowork). Archived 8 orphaned Mission-Control files; added INVENTORY.md. NOTE: this whole session-events mechanism is now itself superseded by the journal (2026-07-09).",
    files_changed: ["tools/log-event.py", ".claude/settings.json", "fred/Mission-Control/INVENTORY.md"],
    tokens: "unknown",
    resume: "",
    event: "backfill",
    followups: [],
  },
  {
    ts: "2026-06-29T17:00:00+07:00",
    run_id: "backfill-20260629-bcc-43",
    harness: "cowork",
    machine: "air",
    project: "BCC",
    persona: "Isosceles",
    status: "done",
    summary: "Rewrote 4.3 assignment on theme->worked->guided->bridge spine; cross-checked all 10 answers vs stats1-answers.pdf (9 matched, Q2 method deviation logged); flagged invented athlete stats. validate-bcc-assignment.py clean.",
    files_changed: ["ASSIGNMENT-PROCESS.md"],
    tokens: "unknown",
    resume: "",
    event: "backfill",
    followups: ["PDF visual verification of Q2/Q9/Q10 on Clint's Mac (no Chrome in sandbox)"],
  },
  {
    ts: "2026-06-28T18:00:00+07:00",
    run_id: "backfill-20260628-chalk-demo",
    harness: "cowork",
    machine: "air",
    project: "Chalk",
    persona: "Fred",
    status: "partial",
    summary: "Cover Finder demo-prep pass: hardened merge_duplicate_teachers, added one-click auto-fill-the-day, polished Teacher Directory + Day Summary print, optional demo-data seed. Built, uncommitted \u2014 awaiting Clint's Mac-side review before the 6/29 demo.",
    files_changed: ["specs/duplicate-merge-run-checklist-2026-06-28.md", "db/seeds/demo_cover_history.rb"],
    tokens: "unknown",
    resume: "",
    event: "backfill",
    followups: ["Review/commit/push/run on Clint's Mac before demo"],
  },
]

/* ── Persona config ── */
export const PERSONAS = {
  all:      { label: 'ALL',             color: '#00D4FF', tag: null        as null,         calId: null },
  fluentrx: { label: 'FluentRx',        color: '#00D4FF', tag: 'fluentrx'  as 'fluentrx',   calId: 'fluentrx@gmail.com' },
  coder:    { label: 'CoderClint',      color: '#A78BFA', tag: 'coder'     as 'coder',      calId: 'coderclint@gmail.com' },
  teacher:  { label: 'ClintTeacher',    color: '#10B981', tag: 'teacher'   as 'teacher',    calId: 'clintteacher@gmail.com' },
  trader:   { label: 'TraderSkinFlint',  color: '#F59E0B', tag: 'trader'    as 'trader',     calId: 'traderskinflint@gmail.com' },
}

export const CALENDAR_SOURCES = [
  { id: 'fluentrx@gmail.com',       tag: 'fluentrx', color: '#00D4FF' },
  { id: 'clintteacher@gmail.com',   tag: 'teacher',  color: '#10B981' },
  { id: 'coderclint@gmail.com',     tag: 'coder',    color: '#A78BFA' },
  { id: 'traderskinflint@gmail.com',tag: 'trader',   color: '#F59E0B' },
]

export const TAG_LABELS: Record<string, string> = {
  fluentrx: 'FluentRx',
  coder:    'CoderClint',
  teacher:  'Teacher',
  trader:   'Trader',
  fred:     'Fred'
}
