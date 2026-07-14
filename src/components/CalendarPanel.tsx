import { useState, useEffect, useRef } from 'react'
import { GOOGLE_CLIENT_ID, CALENDAR_SOURCES, PERSONAS } from '@/data/static'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { Persona } from '@/data/types'

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (resp: { error?: string; access_token: string }) => void
          }) => { requestAccessToken: () => void }
        }
      }
    }
  }
}

interface CalEvent {
  summary?: string
  start: { dateTime?: string; date?: string }
  location?: string
  _calTag: string
  _calColor: string
}

const IS_CONFIGURED = GOOGLE_CLIENT_ID !== 'YOUR_CLIENT_ID_HERE'

export function CalendarPanel({ persona }: { persona: Persona }) {
  const [connected, setConnected] = useState(false)
  const [events, setEvents] = useState<CalEvent[]>([])
  const [loading, setLoading] = useState(false)
  const tokenClientRef = useRef<{ requestAccessToken: () => void } | null>(null)
  const accessTokenRef = useRef<string | null>(null)

  useEffect(() => {
    if (!IS_CONFIGURED) return
    const init = () => {
      if (window.google?.accounts) {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/calendar.readonly',
          callback: async (resp) => {
            if (resp.error) return
            accessTokenRef.current = resp.access_token
            setConnected(true)
            await fetchEvents(resp.access_token)
          }
        })
      } else {
        setTimeout(init, 500)
      }
    }
    init()
  }, [])

  async function fetchEvents(token: string) {
    setLoading(true)
    const now = new Date()
    const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    const all: CalEvent[] = []

    for (const src of CALENDAR_SOURCES) {
      try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(src.id)}/events`
          + `?timeMin=${now.toISOString()}&timeMax=${twoWeeks.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=50`
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          all.push(...(data.items || []).map((e: CalEvent) => ({ ...e, _calTag: src.tag, _calColor: src.color })))
        }
      } catch { /* skip calendar */ }
    }

    all.sort((a, b) => {
      const da = new Date(a.start.dateTime || a.start.date + 'T00:00:00')
      const db = new Date(b.start.dateTime || b.start.date + 'T00:00:00')
      return da.getTime() - db.getTime()
    })
    setEvents(all)
    setLoading(false)
  }

  const handleAuth = () => {
    if (!IS_CONFIGURED) return
    if (accessTokenRef.current) fetchEvents(accessTokenRef.current)
    else tokenClientRef.current?.requestAccessToken()
  }

  const tag = PERSONAS[persona].tag
  const filtered = tag ? events.filter(e => e._calTag === tag) : events

  // Group by date
  const groups = new Map<string, { ev: CalEvent; dt: Date }[]>()
  for (const ev of filtered) {
    const dt = new Date(ev.start.dateTime || ev.start.date + 'T00:00:00')
    const key = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push({ ev, dt })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Upcoming</CardTitle>
        {IS_CONFIGURED && (
          <button
            onClick={handleAuth}
            className="text-[10px] px-3 py-1 rounded cursor-pointer transition-colors duration-150"
            style={{
              fontFamily: "'Space Mono', monospace",
              background: connected ? 'rgba(16,185,129,0.1)' : 'rgba(0,212,255,0.12)',
              border: `1px solid ${connected ? '#10B981' : '#00D4FF'}`,
              color: connected ? '#10B981' : '#00D4FF',
            }}
          >
            {connected ? '✓ Connected' : 'Connect Calendar'}
          </button>
        )}
      </CardHeader>
      <CardContent>
        {!IS_CONFIGURED && (
          <div
            className="p-4 rounded-lg mb-3"
            style={{ background: '#1A2238', border: '1px solid #263350' }}
          >
            <div className="text-[11px] font-semibold mb-2" style={{ color: '#64748B' }}>
              Setup required to connect Google Calendar
            </div>
            <ol className="text-[11px] leading-7 list-none" style={{ color: '#64748B' }}>
              {[
                'Go to console.cloud.google.com',
                'Create project → Enable Google Calendar API',
                'OAuth consent screen → add your email as test user',
                'Credentials → Create OAuth2 Client ID (Web app)',
                'Paste Client ID into GOOGLE_CLIENT_ID in src/data/static.ts',
              ].map((s, i) => (
                <li key={i}>
                  <span style={{ color: '#00D4FF', fontFamily: "'Space Mono', monospace" }}>{i + 1}. </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        )}
        {IS_CONFIGURED && !connected && (
          <div className="text-[11px] italic text-center py-6" style={{ color: '#64748B' }}>
            Click "Connect Calendar" to load events
          </div>
        )}
        {loading && (
          <div className="text-[11px] italic text-center py-6" style={{ color: '#64748B' }}>
            Fetching events…
          </div>
        )}
        {connected && !loading && groups.size === 0 && (
          <div className="text-[11px] italic text-center py-5" style={{ color: '#64748B' }}>
            No events in the next 14 days
          </div>
        )}
        {connected && !loading && [...groups.entries()].map(([day, items]) => (
          <div key={day} className="mb-3.5">
            <div
              className="text-[9px] font-bold uppercase tracking-[0.16em] mb-1.5 pb-1 border-b"
              style={{ color: '#64748B', borderColor: '#1E2D45' }}
            >
              {day}
            </div>
            {items.map(({ ev, dt }, i) => {
              const isAllDay = !ev.start.dateTime
              const timeStr = isAllDay
                ? 'All day'
                : dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
              return (
                <div
                  key={i}
                  className="flex items-start gap-2 py-1.5 border-b last:border-0"
                  style={{ borderColor: '#1E2D45' }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                    style={{ background: ev._calColor }}
                  />
                  <div>
                    <div className="text-[12px] leading-tight" style={{ color: '#E2E8F0' }}>
                      {ev.summary || '(no title)'}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
                      {timeStr}{ev.location ? ` · ${ev.location}` : ''}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
