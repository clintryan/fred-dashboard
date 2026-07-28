import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

loadEnvFile(path.join(rootDir, '.env.local'))

const port = Number(process.env.HABIT_API_PORT || 8787)
const reminderHour = Number(process.env.HABIT_REMINDER_HOUR || 7)
const dbPath = path.resolve(rootDir, process.env.HABIT_DB_PATH || './data/habits.sqlite')
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || ''
const telegramChatId = process.env.TELEGRAM_CHAT_ID || ''

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const contents = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of contents.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const equalsIndex = line.indexOf('=')
    if (equalsIndex === -1) continue

    const key = line.slice(0, equalsIndex).trim()
    const value = line.slice(equalsIndex + 1).trim()
    if (key && !(key in process.env)) {
      process.env[key] = value
    }
  }
}

fs.mkdirSync(path.dirname(dbPath), { recursive: true })

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.exec(`
  CREATE TABLE IF NOT EXISTS habit_entries (
    entry_date TEXT PRIMARY KEY,
    journal TEXT NOT NULL DEFAULT '',
    meal_prep_adherence INTEGER NOT NULL DEFAULT 0,
    alcohol_free INTEGER NOT NULL DEFAULT 0,
    spending_under_100 INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reminder_state (
    reminder_date TEXT PRIMARY KEY,
    sent_at TEXT NOT NULL
  );
`)

const selectEntriesStmt = db.prepare(`
  SELECT
    entry_date,
    journal,
    meal_prep_adherence,
    alcohol_free,
    spending_under_100,
    created_at,
    updated_at
  FROM habit_entries
  ORDER BY entry_date DESC
  LIMIT ?
`)

const selectEntryStmt = db.prepare(`
  SELECT
    entry_date,
    journal,
    meal_prep_adherence,
    alcohol_free,
    spending_under_100,
    created_at,
    updated_at
  FROM habit_entries
  WHERE entry_date = ?
`)

const upsertEntryStmt = db.prepare(`
  INSERT INTO habit_entries (
    entry_date,
    journal,
    meal_prep_adherence,
    alcohol_free,
    spending_under_100,
    created_at,
    updated_at
  ) VALUES (
    @entry_date,
    @journal,
    @meal_prep_adherence,
    @alcohol_free,
    @spending_under_100,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
  ON CONFLICT(entry_date) DO UPDATE SET
    journal = excluded.journal,
    meal_prep_adherence = excluded.meal_prep_adherence,
    alcohol_free = excluded.alcohol_free,
    spending_under_100 = excluded.spending_under_100,
    updated_at = CURRENT_TIMESTAMP
`)

const reminderSeenStmt = db.prepare(`SELECT sent_at FROM reminder_state WHERE reminder_date = ?`)
const reminderMarkStmt = db.prepare(`
  INSERT INTO reminder_state (reminder_date, sent_at)
  VALUES (?, CURRENT_TIMESTAMP)
  ON CONFLICT(reminder_date) DO UPDATE SET sent_at = CURRENT_TIMESTAMP
`)

function isoDate(value = new Date()) {
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function weekdayName(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' })
}

function normalizeEntry(row) {
  if (!row) return null
  return {
    date: row.entry_date,
    journal: row.journal,
    mealPrepAdherence: Boolean(row.meal_prep_adherence),
    alcoholFree: Boolean(row.alcohol_free),
    spendingUnder100: Boolean(row.spending_under_100),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function computeStreak(entries, key) {
  let streak = 0
  for (const entry of entries) {
    if (!entry[key]) break
    streak += 1
  }
  return streak
}

function cleanJournal(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join('\n')
}

function buildDayFocus(dateString) {
  const day = weekdayName(dateString)
  const lines = []

  if (day === 'Sunday') {
    lines.push('Set the week in order tonight. Prep generously so Monday through Friday becomes easier than impulse.')
  }
  if (day === 'Tuesday' || day === 'Wednesday') {
    lines.push('At 5:00 PM, take the old thirst to the racket court. Let movement spend what drink would waste.')
  }
  if (day === 'Friday') {
    lines.push('Keep the plan through breakfast and lunch. Fish and chips at night is allowed because it is chosen, not drifted into.')
  }
  if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)) {
    lines.push('Carry the 100 baht limit as a deliberate boundary. Cash leaves the hand faster when the mind is lazy.')
  }
  if (lines.length === 0) {
    lines.push('Use the quiet day to make the next disciplined day easier.')
  }

  return lines
}

function buildReminderMessage(dateString = isoDate()) {
  const day = weekdayName(dateString)
  const focus = buildDayFocus(dateString)

  return [
    `Good morning, Clint. ${day} asks for steadiness, not drama.`,
    'Guard three things tonight: keep to the meal plan, remain alcohol-free, and stay under 100 baht of discretionary spending.',
    ...focus,
    'This evening, write three honest lines. A life is improved by what is observed and repeated.',
  ].join('\n\n')
}

function getRulesBlurb() {
  return {
    mealPrep: 'Sunday prep covers Mon-Thu breakfast/lunch/dinner plus Fri breakfast/lunch. Friday night fish and chips is allowed.',
    alcohol: 'Racket sports on Tuesday and Wednesday from 5-6 PM is the replacement outlet.',
    spending: 'School-day discretionary spending is capped at roughly 100 baht in cash.',
  }
}

function getSummary() {
  const rows = selectEntriesStmt.all(21).map(normalizeEntry)
  const today = isoDate()
  const todayEntry = rows.find((entry) => entry.date === today) || {
    date: today,
    journal: '',
    mealPrepAdherence: false,
    alcoholFree: false,
    spendingUnder100: false,
  }

  return {
    today,
    todayEntry,
    entries: rows,
    streaks: {
      mealPrep: computeStreak(rows, 'mealPrepAdherence'),
      alcoholFree: computeStreak(rows, 'alcoholFree'),
      spendingUnder100: computeStreak(rows, 'spendingUnder100'),
      cleanDay: computeStreak(
        rows.map((entry) => ({ cleanDay: entry.mealPrepAdherence && entry.alcoholFree && entry.spendingUnder100 })),
        'cleanDay',
      ),
    },
    rules: getRulesBlurb(),
    reminder: {
      enabled: Boolean(telegramBotToken && telegramChatId),
      hour: reminderHour,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      preview: buildReminderMessage(today),
    },
  }
}

async function sendTelegramMessage(text) {
  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text,
    }),
  })

  if (!response.ok) {
    throw new Error(`Telegram send failed: ${response.status} ${await response.text()}`)
  }
}

async function maybeSendScheduledReminder(now = new Date()) {
  const today = isoDate(now)
  if (reminderSeenStmt.get(today)) return

  if (!telegramBotToken || !telegramChatId) {
    console.log(`[habit-reminder] ${today} not sent: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing`)
    return
  }

  const message = buildReminderMessage(today)
  await sendTelegramMessage(message)
  reminderMarkStmt.run(today)
  console.log(`[habit-reminder] sent for ${today}`)
}

function scheduleReminderLoop() {
  const now = new Date()
  const next = new Date(now)
  next.setHours(reminderHour, 0, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)

  const delay = next.getTime() - now.getTime()
  setTimeout(async () => {
    try {
      await maybeSendScheduledReminder(new Date())
    } catch (error) {
      console.error('[habit-reminder] scheduled send failed', error)
    }

    setInterval(async () => {
      try {
        await maybeSendScheduledReminder(new Date())
      } catch (error) {
        console.error('[habit-reminder] scheduled send failed', error)
      }
    }, 24 * 60 * 60 * 1000)
  }, delay)

  console.log(`[habit-reminder] next run at ${next.toString()}`)
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(payload))
}

async function handleRequest(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`)

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/habits/summary') {
    sendJson(res, 200, getSummary())
    return
  }

  if (req.method === 'GET' && requestUrl.pathname.startsWith('/api/habits/entries/')) {
    const date = requestUrl.pathname.split('/').pop()
    const entry = normalizeEntry(selectEntryStmt.get(date))
    sendJson(res, 200, { entry })
    return
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/habits/entries') {
    try {
      const payload = await readJson(req)
      const date = String(payload.date || isoDate())
      const entry = {
        entry_date: date,
        journal: cleanJournal(payload.journal),
        meal_prep_adherence: payload.mealPrepAdherence ? 1 : 0,
        alcohol_free: payload.alcoholFree ? 1 : 0,
        spending_under_100: payload.spendingUnder100 ? 1 : 0,
      }

      upsertEntryStmt.run(entry)
      sendJson(res, 200, { ok: true, summary: getSummary() })
    } catch (error) {
      sendJson(res, 400, { ok: false, error: `Invalid payload: ${error.message}` })
    }
    return
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/habits/reminder-preview') {
    const date = String(requestUrl.searchParams.get('date') || isoDate())
    sendJson(res, 200, { date, message: buildReminderMessage(date) })
    return
  }

  sendJson(res, 404, { error: 'Not found' })
}

http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    console.error('[habit-api] request failed', error)
    sendJson(res, 500, { error: 'Internal server error' })
  })
}).listen(port, () => {
  console.log(`[habit-api] listening on http://127.0.0.1:${port}`)
  console.log(`[habit-api] sqlite db: ${dbPath}`)
})

scheduleReminderLoop()
