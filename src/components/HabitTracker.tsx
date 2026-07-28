import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardMeta, CardContent } from '@/components/ui/card'

interface HabitEntry {
  date: string
  journal: string
  mealPrepAdherence: boolean
  alcoholFree: boolean
  spendingUnder100: boolean
}

interface HabitSummary {
  today: string
  todayEntry: HabitEntry
  entries: HabitEntry[]
  streaks: {
    mealPrep: number
    alcoholFree: number
    spendingUnder100: number
    cleanDay: number
  }
  rules: {
    mealPrep: string
    alcohol: string
    spending: string
  }
  reminder: {
    enabled: boolean
    hour: number
    timezone: string
    preview: string
  }
}

const fallbackSummary: HabitSummary = {
  today: new Date().toISOString().slice(0, 10),
  todayEntry: {
    date: new Date().toISOString().slice(0, 10),
    journal: '',
    mealPrepAdherence: false,
    alcoholFree: false,
    spendingUnder100: false,
  },
  entries: [],
  streaks: {
    mealPrep: 0,
    alcoholFree: 0,
    spendingUnder100: 0,
    cleanDay: 0,
  },
  rules: {
    mealPrep: 'Sunday prep covers Mon-Thu plus Friday breakfast/lunch.',
    alcohol: 'Tuesday and Wednesday racket sports replaces the drinking slot.',
    spending: 'School-day discretionary target is 100 baht cash.',
  },
  reminder: {
    enabled: false,
    hour: 7,
    timezone: 'Asia/Bangkok',
    preview: 'Start the local habit service to load the live reminder preview.',
  },
}

function HabitToggle({
  label,
  active,
  onClick,
  tone = 'cyan',
}: {
  label: string
  active: boolean
  onClick: () => void
  tone?: 'cyan' | 'green' | 'amber'
}) {
  const color = tone === 'green' ? '#10B981' : tone === 'amber' ? '#F59E0B' : '#00D4FF'

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-left transition-colors duration-150 cursor-pointer"
      style={{
        border: `1px solid ${active ? color : '#263350'}`,
        background: active ? `${color}14` : '#1A2238',
        color: active ? '#E2E8F0' : '#94A3B8',
      }}
    >
      <div className="text-[10px] uppercase tracking-[0.12em] mb-1" style={{ fontFamily: "'Space Mono', monospace", color }}>
        {active ? 'Yes' : 'No'}
      </div>
      <div className="text-[12px] leading-[1.45]">{label}</div>
    </button>
  )
}

function StreakCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg px-3.5 py-3" style={{ background: '#1A2238', border: '1px solid #263350' }}>
      <div className="text-[10px] uppercase tracking-[0.12em] mb-1" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
        {label}
      </div>
      <div className="text-[24px] font-bold leading-none" style={{ fontFamily: "'Space Mono', monospace", color: '#E2E8F0' }}>
        {value}
      </div>
    </div>
  )
}

export function HabitTracker() {
  const [summary, setSummary] = useState<HabitSummary>(fallbackSummary)
  const [form, setForm] = useState<HabitEntry>(fallbackSummary.todayEntry)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveNote, setSaveNote] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSummary() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/habits/summary')
        if (!response.ok) throw new Error(`Habit API returned ${response.status}`)
        const data = await response.json() as HabitSummary
        if (cancelled) return
        setSummary(data)
        setForm(data.todayEntry)
      } catch (loadError) {
        if (cancelled) return
        setError('Local habit service offline. Run `npm run server` to save entries and enable SQLite + Telegram scheduling.')
        setSummary(fallbackSummary)
        setForm(fallbackSummary.todayEntry)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSummary()
    return () => {
      cancelled = true
    }
  }, [])

  async function saveEntry() {
    try {
      setSaving(true)
      setSaveNote(null)
      setError(null)
      const response = await fetch('/api/habits/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error(`Save failed with ${response.status}`)
      const data = await response.json() as { summary: HabitSummary }
      setSummary(data.summary)
      setForm(data.summary.todayEntry)
      setSaveNote('Saved to SQLite.')
    } catch (saveError) {
      setError('Save failed. Check that the local habit service is running.')
    } finally {
      setSaving(false)
    }
  }

  const recentEntries = summary.entries.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Habit Tracker</CardTitle>
          <CardMeta>nightly journal · meal prep · alcohol-free · under 100 baht</CardMeta>
        </div>
        <div className="text-right">
          <div className="text-[10px]" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
            Reminder
          </div>
          <div className="text-[12px] font-semibold" style={{ color: summary.reminder.enabled ? '#10B981' : '#F59E0B' }}>
            {summary.reminder.enabled ? `7:00 AM Telegram · ${summary.reminder.timezone}` : 'Preview mode until Telegram env is set'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1.3fr 0.9fr' }}>
          <div className="rounded-xl p-4" style={{ background: '#101726', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em]" style={{ fontFamily: "'Space Mono', monospace", color: '#00D4FF' }}>
                  {form.date}
                </div>
                <div className="text-[17px] font-semibold" style={{ color: '#E2E8F0' }}>
                  Tonight&apos;s check-in
                </div>
              </div>
              <button
                type="button"
                onClick={saveEntry}
                disabled={saving || loading}
                className="rounded-lg px-3.5 py-2 text-[11px] font-semibold cursor-pointer disabled:cursor-not-allowed"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  background: saving ? '#1E2D45' : '#00D4FF',
                  color: saving ? '#64748B' : '#08111F',
                  border: 'none',
                }}
              >
                {saving ? 'Saving…' : 'Save entry'}
              </button>
            </div>

            <textarea
              value={form.journal}
              onChange={(event) => setForm((prev) => ({ ...prev, journal: event.target.value }))}
              rows={4}
              placeholder={'Three honest lines.\n1. What held?\n2. What slipped?\n3. What changes tomorrow?'}
              className="w-full rounded-lg px-3 py-3 mb-3 resize-none"
              style={{
                background: '#1A2238',
                border: '1px solid #263350',
                color: '#E2E8F0',
              }}
            />

            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <HabitToggle
                label="Stayed on the meal-prep plan"
                active={form.mealPrepAdherence}
                onClick={() => setForm((prev) => ({ ...prev, mealPrepAdherence: !prev.mealPrepAdherence }))}
              />
              <HabitToggle
                label="Stayed alcohol-free"
                active={form.alcoholFree}
                onClick={() => setForm((prev) => ({ ...prev, alcoholFree: !prev.alcoholFree }))}
                tone="green"
              />
              <HabitToggle
                label="Kept spending under 100 baht"
                active={form.spendingUnder100}
                onClick={() => setForm((prev) => ({ ...prev, spendingUnder100: !prev.spendingUnder100 }))}
                tone="amber"
              />
            </div>

            {(error || saveNote) && (
              <div className="mt-3 text-[11px]" style={{ color: error ? '#F59E0B' : '#10B981' }}>
                {error || saveNote}
              </div>
            )}
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <StreakCard label="Meal prep streak" value={summary.streaks.mealPrep} />
            <StreakCard label="Alcohol-free streak" value={summary.streaks.alcoholFree} />
            <StreakCard label="100 baht streak" value={summary.streaks.spendingUnder100} />
            <StreakCard label="Clean days logged" value={summary.streaks.cleanDay} />
          </div>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="rounded-xl p-4" style={{ background: '#101726', border: '1px solid #1E2D45' }}>
            <div className="text-[10px] uppercase tracking-[0.16em] mb-2" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
              Rules
            </div>
            <div className="text-[12px] leading-[1.7]" style={{ color: '#CBD5E1' }}>
              <p className="mb-2">{summary.rules.mealPrep}</p>
              <p className="mb-2">{summary.rules.alcohol}</p>
              <p>{summary.rules.spending}</p>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: '#101726', border: '1px solid #1E2D45' }}>
            <div className="text-[10px] uppercase tracking-[0.16em] mb-2" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
              7:00 AM Telegram
            </div>
            <div className="text-[12px] leading-[1.7] whitespace-pre-wrap" style={{ color: '#CBD5E1' }}>
              {summary.reminder.preview}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: '#101726', border: '1px solid #1E2D45' }}>
            <div className="text-[10px] uppercase tracking-[0.16em] mb-2" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
              Recent entries
            </div>
            {loading ? (
              <div className="text-[12px] italic" style={{ color: '#64748B' }}>Loading habit history…</div>
            ) : recentEntries.length === 0 ? (
              <div className="text-[12px] italic" style={{ color: '#64748B' }}>No entries yet.</div>
            ) : (
              recentEntries.map((entry) => (
                <div key={entry.date} className="py-2 border-b last:border-0" style={{ borderColor: '#1E2D45' }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[11px] font-semibold" style={{ color: '#E2E8F0' }}>{entry.date}</div>
                    <div className="text-[10px]" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
                      {entry.mealPrepAdherence ? 'M' : '-'} {entry.alcoholFree ? 'A' : '-'} {entry.spendingUnder100 ? 'S' : '-'}
                    </div>
                  </div>
                  <div className="text-[12px] whitespace-pre-wrap" style={{ color: '#94A3B8' }}>
                    {entry.journal || 'No journal yet.'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
